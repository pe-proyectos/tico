import { Elysia, t } from "elysia";
import { prisma } from "../lib/prisma";
import { getUserFromToken, type AuthUser } from "../middleware/auth";
import { PLAN_LIMITS } from "../lib/pricing";
import { broadcastTripUpdate, subscribeToTrip } from "../lib/realtime";
import { updateDriverLocation } from "../lib/locations";

function requireDriver(set: any, user: AuthUser | null): user is AuthUser & { driver: NonNullable<AuthUser["driver"]> } {
  if (!user) { set.status = 401; return false; }
  if (!user.driver) { set.status = 403; return false; }
  return true;
}

const TZ_OFFSET = Number(process.env.TZ_OFFSET_HOURS) || -5;

// Reset tripsToday if lastTripReset is before today in local time
async function resetIfNeeded(driverId: string, lastReset: Date, tripsToday: number) {
  const now = new Date();
  const localNow = new Date(now.getTime() + TZ_OFFSET * 60 * 60 * 1000);
  const localReset = new Date(lastReset.getTime() + TZ_OFFSET * 60 * 60 * 1000);
  if (localNow.toUTCString().slice(0, 16) !== localReset.toUTCString().slice(0, 16)) {
    await prisma.driver.update({ where: { id: driverId }, data: { tripsToday: 0, lastTripReset: now } });
    return 0;
  }
  return tripsToday;
}

export const driverRoutes = new Elysia({ prefix: "/api" })
  .derive(async ({ headers }) => {
    const user = await getUserFromToken(headers.authorization);
    return { user };
  })

  .post("/driver/register", async ({ body, user, set }) => {
    if (!user) { set.status = 401; return { error: "Unauthorized" }; }
    if (user.driver) { set.status = 400; return { error: "Already registered as driver" }; }
    // License plate validation: 6-8 alphanumeric + dash chars
    if (!/^[A-Za-z0-9\-]{6,8}$/.test(body.licensePlate)) {
      set.status = 400; return { error: "Invalid license plate format. Must be 6-8 alphanumeric characters." };
    }
    const driver = await prisma.driver.create({
      data: {
        userId: user.id,
        licensePlate: body.licensePlate,
        vehicleBrand: body.vehicleBrand,
        vehicleModel: body.vehicleModel,
        vehicleColor: body.vehicleColor,
        status: "APPROVED", // Auto-approve for MVP
      },
    });
    await prisma.user.update({ where: { id: user.id }, data: { role: "DRIVER" } });
    return { ok: true, driver };
  }, {
    body: t.Object({
      licensePlate: t.String(),
      vehicleBrand: t.String(),
      vehicleModel: t.String(),
      vehicleColor: t.String(),
    })
  })

  .get("/driver/history", async ({ user, set }) => {
    if (!requireDriver(set, user)) return { error: "Forbidden" };
    const trips = await prisma.trip.findMany({
      where: { driverId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    const earnings = trips
      .filter(t => t.status === "COMPLETED")
      .reduce((sum, t) => sum + (t.finalPrice || t.estimatedPrice), 0);
    return { ok: true, trips, earnings: Math.round(earnings * 100) / 100 };
  })

  .patch("/driver/availability", async ({ body, user, set }) => {
    if (!requireDriver(set, user)) return { error: "Forbidden" };
    if (user.driver.status !== "APPROVED") { set.status = 403; return { error: "Driver not approved" }; }
    const updated = await prisma.driver.update({
      where: { id: user.driver.id },
      data: { isAvailable: body.available },
    });
    return { ok: true, isAvailable: updated.isAvailable };
  }, {
    body: t.Object({ available: t.Boolean() })
  })

  .get("/driver/requests", async ({ user, set }) => {
    if (!requireDriver(set, user)) return { error: "Forbidden" };
    if (user.driver.status !== "APPROVED") { set.status = 403; return { error: "Driver not approved" }; }
    const trips = await prisma.trip.findMany({
      where: { status: "SEARCHING" },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { passenger: true },
    });
    return { ok: true, trips };
  })

  .get("/driver/stats", async ({ user, set }) => {
    if (!requireDriver(set, user)) return { error: "Forbidden" };
    const tripsToday = await resetIfNeeded(user.driver.id, user.driver.lastTripReset, user.driver.tripsToday);
    // Compute midnight in local timezone (TZ_OFFSET) as UTC timestamp
    const now = new Date();
    const localMs = now.getTime() + TZ_OFFSET * 60 * 60 * 1000;
    const localMidnight = new Date(localMs);
    localMidnight.setUTCHours(0, 0, 0, 0);
    const todayStart = new Date(localMidnight.getTime() - TZ_OFFSET * 60 * 60 * 1000);
    
    const completedToday = await prisma.trip.findMany({
      where: { driverId: user.id, status: "COMPLETED", completedAt: { gte: todayStart } },
    });
    const earnings = completedToday.reduce((sum, t) => sum + (t.finalPrice || t.estimatedPrice), 0);
    
    return { ok: true, tripsToday, earnings: Math.round(earnings * 100) / 100, planType: user.driver.planType, limit: PLAN_LIMITS[user.driver.planType] };
  })

  .post("/trips/:id/accept", async ({ params, user, set }) => {
    if (!requireDriver(set, user)) return { error: "Forbidden" };
    if (user.driver.status !== "APPROVED" || !user.driver.isAvailable) {
      set.status = 403; return { error: "Not available" };
    }

    const tripsToday = await resetIfNeeded(user.driver.id, user.driver.lastTripReset, user.driver.tripsToday);
    const limit = PLAN_LIMITS[user.driver.planType];
    if (tripsToday >= limit) { set.status = 403; return { error: "Daily trip limit reached" }; }

    const trip = await prisma.trip.findUnique({ where: { id: params.id } });
    if (!trip || trip.status !== "SEARCHING") { set.status = 400; return { error: "Trip unavailable" }; }

    const updated = await prisma.trip.update({
      where: { id: params.id },
      data: { driverId: user.id, status: "ACCEPTED", acceptedAt: new Date() },
      include: { passenger: true, driver: { include: { driver: true } } },
    });
    subscribeToTrip(params.id, user.id);
    subscribeToTrip(params.id, trip.passengerId);
    broadcastTripUpdate(params.id, updated);
    return { ok: true, trip: updated };
  })

  .post("/trips/:id/arrive", async ({ params, user, set }) => {
    if (!requireDriver(set, user)) return { error: "Forbidden" };
    const trip = await prisma.trip.findUnique({ where: { id: params.id } });
    if (!trip || trip.driverId !== user.id || trip.status !== "ACCEPTED") {
      set.status = 400; return { error: "Invalid state" };
    }
    const updated = await prisma.trip.update({ where: { id: params.id }, data: { status: "DRIVER_ARRIVING" } });
    broadcastTripUpdate(params.id, updated);
    return { ok: true, trip: updated };
  })

  .post("/trips/:id/start", async ({ params, user, set }) => {
    if (!requireDriver(set, user)) return { error: "Forbidden" };
    const trip = await prisma.trip.findUnique({ where: { id: params.id } });
    if (!trip || trip.driverId !== user.id || trip.status !== "DRIVER_ARRIVING") {
      set.status = 400; return { error: "Invalid state" };
    }
    const updated = await prisma.trip.update({ where: { id: params.id }, data: { status: "IN_PROGRESS", startedAt: new Date() } });
    broadcastTripUpdate(params.id, updated);
    return { ok: true, trip: updated };
  })

  .post("/trips/:id/complete", async ({ params, user, set }) => {
    if (!requireDriver(set, user)) return { error: "Forbidden" };
    const trip = await prisma.trip.findUnique({ where: { id: params.id } });
    if (!trip || trip.driverId !== user.id || trip.status !== "IN_PROGRESS") {
      set.status = 400; return { error: "Invalid state" };
    }
    const updated = await prisma.trip.update({
      where: { id: params.id },
      // TODO: Recalculate finalPrice based on actual route/distance instead of using estimate
      data: { status: "COMPLETED", finalPrice: trip.estimatedPrice, completedAt: new Date() },
    });
    await prisma.driver.update({
      where: { id: user.driver!.id },
      data: { tripsToday: { increment: 1 } },
    });
    broadcastTripUpdate(params.id, updated);
    return { ok: true, trip: updated };
  })

  .post("/driver/location", async ({ body, user, set }) => {
    if (!requireDriver(set, user)) return { error: "Forbidden" };
    updateDriverLocation(user.id, body.lat, body.lng);
    return { ok: true };
  }, {
    body: t.Object({ lat: t.Number(), lng: t.Number() })
  })

  .post("/driver/upgrade-plan", async ({ body, user, set }) => {
    if (!requireDriver(set, user)) return { error: "Forbidden" };
    if (!["PRO", "BUSINESS"].includes(body.plan)) {
      set.status = 400; return { error: "Invalid plan. Must be PRO or BUSINESS." };
    }
    const updated = await prisma.driver.update({
      where: { id: user.driver.id },
      data: { planType: body.plan as any },
    });
    return { ok: true, driver: updated };
  }, {
    body: t.Object({ plan: t.String() })
  })

  .patch("/driver/vehicle", async ({ body, user, set }) => {
    if (!requireDriver(set, user)) return { error: "Forbidden" };
    const data: any = {};
    for (const field of ["licensePlate", "vehicleBrand", "vehicleModel", "vehicleColor"] as const) {
      if (body[field] !== undefined) {
        if (typeof body[field] !== "string" || body[field].trim() === "") {
          set.status = 400; return { error: `${field} must be a non-empty string` };
        }
        data[field] = body[field];
      }
    }
    if (data.licensePlate && !/^[A-Za-z0-9\-]{6,8}$/.test(data.licensePlate)) {
      set.status = 400; return { error: "Invalid license plate format" };
    }
    const updated = await prisma.driver.update({ where: { id: user.driver.id }, data });
    return { ok: true, driver: updated };
  }, {
    body: t.Object({
      licensePlate: t.Optional(t.String()),
      vehicleBrand: t.Optional(t.String()),
      vehicleModel: t.Optional(t.String()),
      vehicleColor: t.Optional(t.String()),
    })
  });
