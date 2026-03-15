import { Elysia, t } from "elysia";
import { prisma } from "../lib/prisma";
import { getUserFromToken, type AuthUser } from "../middleware/auth";
import { estimatePrice } from "../lib/pricing";

function requireAuth(set: any, user: AuthUser | null): user is AuthUser {
  if (!user) { set.status = 401; return false; }
  return true;
}

export const tripRoutes = new Elysia({ prefix: "/api/trips" })
  .derive(async ({ headers }) => {
    const user = await getUserFromToken(headers.authorization);
    return { user };
  })

  .get("/estimate", ({ query }) => {
    const { originLat, originLng, destLat, destLng } = query;
    const result = estimatePrice(Number(originLat), Number(originLng), Number(destLat), Number(destLng));
    return { ok: true, ...result };
  }, {
    query: t.Object({
      originLat: t.String(), originLng: t.String(),
      destLat: t.String(), destLng: t.String()
    })
  })

  .post("/", async ({ body, user, set }) => {
    if (!requireAuth(set, user)) return { error: "Unauthorized" };

    const est = estimatePrice(body.originLat, body.originLng, body.destLat, body.destLng);
    const trip = await prisma.trip.create({
      data: {
        passengerId: user.id,
        originLat: body.originLat, originLng: body.originLng, originAddress: body.originAddress,
        destLat: body.destLat, destLng: body.destLng, destAddress: body.destAddress,
        estimatedPrice: est.price, status: "SEARCHING",
      },
    });
    return { ok: true, trip };
  }, {
    body: t.Object({
      originLat: t.Number(), originLng: t.Number(), originAddress: t.String(),
      destLat: t.Number(), destLng: t.Number(), destAddress: t.String(),
    })
  })

  .get("/:id", async ({ params, user, set }) => {
    if (!requireAuth(set, user)) return { error: "Unauthorized" };
    const trip = await prisma.trip.findUnique({
      where: { id: params.id },
      include: { passenger: true, driver: { include: { driver: true } } },
    });
    if (!trip) { set.status = 404; return { error: "Trip not found" }; }
    return { ok: true, trip };
  })

  .post("/:id/cancel", async ({ params, user, set }) => {
    if (!requireAuth(set, user)) return { error: "Unauthorized" };
    const trip = await prisma.trip.findUnique({ where: { id: params.id } });
    if (!trip || trip.passengerId !== user.id) { set.status = 403; return { error: "Forbidden" }; }
    if (trip.status === "COMPLETED" || trip.status === "CANCELLED") {
      set.status = 400; return { error: "Cannot cancel" };
    }
    const updated = await prisma.trip.update({ where: { id: params.id }, data: { status: "CANCELLED" } });
    return { ok: true, trip: updated };
  })

  .post("/:id/rate", async ({ params, body, user, set }) => {
    if (!requireAuth(set, user)) return { error: "Unauthorized" };
    const trip = await prisma.trip.findUnique({ where: { id: params.id } });
    if (!trip || trip.status !== "COMPLETED") { set.status = 400; return { error: "Trip not completed" }; }

    const toUserId = trip.passengerId === user.id ? trip.driverId : trip.passengerId;
    if (!toUserId) { set.status = 400; return { error: "No one to rate" }; }

    const existing = await prisma.rating.findFirst({ where: { tripId: params.id, fromUserId: user.id } });
    if (existing) { set.status = 400; return { error: "Already rated" }; }

    const rating = await prisma.rating.create({
      data: { tripId: params.id, fromUserId: user.id, toUserId, stars: body.stars },
    });

    // Update user rating
    const target = await prisma.user.findUnique({ where: { id: toUserId } });
    if (target) {
      const newCount = target.ratingCount + 1;
      const newRating = (target.rating * target.ratingCount + body.stars) / newCount;
      await prisma.user.update({ where: { id: toUserId }, data: { rating: newRating, ratingCount: newCount } });
    }

    return { ok: true, rating };
  }, {
    body: t.Object({ stars: t.Number({ minimum: 1, maximum: 5 }) })
  });
