import { Elysia, t } from "elysia";
import { prisma } from "../lib/prisma";
import { getUserFromToken, type AuthUser } from "../middleware/auth";

function requireAdmin(set: any, user: AuthUser | null): user is AuthUser {
  if (!user) { set.status = 401; return false; }
  if (user.role !== "ADMIN") { set.status = 403; return false; }
  return true;
}

export const adminRoutes = new Elysia({ prefix: "/api/admin" })
  .derive(async ({ headers }) => {
    const user = await getUserFromToken(headers.authorization);
    return { user };
  })

  .get("/drivers", async ({ query, user, set }) => {
    if (!requireAdmin(set, user)) return { error: "Forbidden" };
    const where: any = {};
    if (query.status) where.status = query.status;
    const drivers = await prisma.driver.findMany({ where, include: { user: true }, orderBy: { user: { createdAt: "desc" } } });
    return { ok: true, drivers };
  }, {
    query: t.Object({ status: t.Optional(t.String()) })
  })

  .patch("/drivers/:id", async ({ params, body, user, set }) => {
    if (!requireAdmin(set, user)) return { error: "Forbidden" };
    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'];
    if (body.status && !validStatuses.includes(body.status)) {
      set.status = 400; return { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` };
    }
    const data: any = {};
    if (body.status) data.status = body.status;
    const updated = await prisma.driver.update({ where: { id: params.id }, data, include: { user: true } });
    return { ok: true, driver: updated };
  }, {
    body: t.Object({ status: t.Optional(t.String()) })
  })

  .get("/dashboard", async ({ user, set }) => {
    if (!requireAdmin(set, user)) return { error: "Forbidden" };
    const [totalUsers, totalDrivers, totalTrips, completedTrips, activeTrips] = await Promise.all([
      prisma.user.count(),
      prisma.driver.count(),
      prisma.trip.count(),
      prisma.trip.count({ where: { status: "COMPLETED" } }),
      prisma.trip.count({ where: { status: { in: ["SEARCHING", "ACCEPTED", "DRIVER_ARRIVING", "IN_PROGRESS"] } } }),
    ]);
    return { ok: true, totalUsers, totalDrivers, totalTrips, completedTrips, activeTrips };
  })

  .get("/trips", async ({ query, user, set }) => {
    if (!requireAdmin(set, user)) return { error: "Forbidden" };
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 20);
    const [trips, total] = await Promise.all([
      prisma.trip.findMany({
        skip: (page - 1) * limit, take: limit,
        orderBy: { createdAt: "desc" },
        include: { passenger: true, driver: true },
      }),
      prisma.trip.count(),
    ]);
    return { ok: true, trips, total, page, pages: Math.ceil(total / limit) };
  }, {
    query: t.Object({ page: t.Optional(t.String()), limit: t.Optional(t.String()) })
  });
