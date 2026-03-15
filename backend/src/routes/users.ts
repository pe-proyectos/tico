import { Elysia, t } from "elysia";
import { prisma } from "../lib/prisma";
import { getUserFromToken, type AuthUser } from "../middleware/auth";

function requireAuth(set: any, user: AuthUser | null): user is AuthUser {
  if (!user) { set.status = 401; return false; }
  return true;
}

export const userRoutes = new Elysia({ prefix: "/api/users" })
  .derive(async ({ headers }) => {
    const user = await getUserFromToken(headers.authorization);
    return { user };
  })

  .get("/me", async ({ user, set }) => {
    if (!requireAuth(set, user)) return { error: "Unauthorized" };
    const tripCount = await prisma.trip.count({ where: { passengerId: user.id } });
    return { ...user, tripCount };
  })

  .patch("/me", async ({ body, user, set }) => {
    if (!requireAuth(set, user)) return { error: "Unauthorized" };
    const data: any = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.email !== undefined) data.email = body.email;
    const updated = await prisma.user.update({ where: { id: user.id }, data });
    return { ok: true, user: updated };
  }, {
    body: t.Object({
      name: t.Optional(t.String()),
      email: t.Optional(t.String()),
    })
  })

  .get("/me/trips", async ({ user, set }) => {
    if (!requireAuth(set, user)) return { error: "Unauthorized" };
    const trips = await prisma.trip.findMany({
      where: { passengerId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return { ok: true, trips };
  });
