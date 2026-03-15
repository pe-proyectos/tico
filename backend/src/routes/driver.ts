import { Elysia, t } from "elysia";
import { prisma } from "../lib/prisma";
import { getUserFromToken, type AuthUser } from "../middleware/auth";
import { PLAN_LIMITS } from "../lib/pricing";

function requireDriver(set: any, user: AuthUser | null): user is AuthUser & { driver: NonNullable<AuthUser["driver"]> } {
  if (!user) { set.status = 401; return false; }
  if (!user.driver) { set.status = 403; return false; }
  return true;
}

// Reset tripsToday if lastTripReset is before today in Peru time (UTC-5)
async function resetIfNeeded(driverId: string, lastReset: Date, tripsToday: number) {
  const now = new Date();
  const peruNow = new Date(now.getTime() - 5 * 60 * 60 * 1000);
  const peruReset = new Date(lastReset.getTime() - 5 * 60 * 60 * 1000);
  if (peruNow.toDateString() !== peruReset.toDateString()) {
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
    const driver = await prisma.driver.create({
      data: {
        userId: user.id,
        licensePlate: body.licensePlate,
        vehicleBrand: body.vehicleBrand,
        vehicleModel: body.vehicleModel,
        vehicleColor: body.vehicleColor,
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
    const todayStart = new Date();
    todayStart.setUTCHours(todayStart.getUTCHours() - 5); // Peru
    todayStart.setHours(0, 0, 0, 0);
    
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
    return { ok: true, trip: updated };
  })

  .post("/trips/:id/arrive", async ({ params, user, set }) => {
    if (!requireDriver(set, user)) return { error: "Forbidden" };
    const trip = await prisma.trip.findUnique({ where: { id: params.id } });
    if (!trip || trip.driverId !== user.id || trip.status !== "ACCEPTED") {
      set.status = 400; return { error: "Invalid state" };
    }
    const updated = await prisma.trip.update({ where: { id: params.id }, data: { status: "DRIVER_ARRIVING" } });
    return { ok: true, trip: updated };
  })

  .post("/trips/:id/start", async ({ params, user, set }) => {
    if (!requireDriver(set, user)) return { error: "Forbidden" };
    const trip = await prisma.trip.findUnique({ where: { id: params.id } });
    if (!trip || trip.driverId !== user.id || trip.status !== "DRIVER_ARRIVING") {
      set.status = 400; return { error: "Invalid state" };
    }
    const updated = await prisma.trip.update({ where: { id: params.id }, data: { status: "IN_PROGRESS", startedAt: new Date() } });
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
      data: { status: "COMPLETED", finalPrice: trip.estimatedPrice, completedAt: new Date() },
    });
    await prisma.driver.update({
      where: { id: user.driver!.id },
      data: { tripsToday: { increment: 1 } },
    });
    return { ok: true, trip: updated };
  });
