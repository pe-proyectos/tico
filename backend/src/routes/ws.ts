import { Elysia } from "elysia";
import { getUserFromToken } from "../middleware/auth";
import { subscribe, unsubscribe, subscribeToTrip } from "../lib/realtime";
import { prisma } from "../lib/prisma";

export const wsRoutes = new Elysia()
  .ws("/api/ws", {
    async open(ws) {
      const url = ws.data.query as any;
      const token = url?.token;
      if (!token) { ws.close(); return; }

      const user = await getUserFromToken(`Bearer ${token}`);
      if (!user) { ws.close(); return; }

      (ws as any)._userId = user.id;
      subscribe(user.id, ws);

      // Auto-subscribe to active trips
      const activeTrips = await prisma.trip.findMany({
        where: {
          OR: [
            { passengerId: user.id },
            { driverId: user.id },
          ],
          status: { notIn: ["COMPLETED", "CANCELLED"] },
        },
      });
      for (const trip of activeTrips) {
        subscribeToTrip(trip.id, user.id);
      }

      ws.send(JSON.stringify({ type: "connected", userId: user.id, activeTrips: activeTrips.map(t => t.id) }));
    },
    message(ws, message) {
      try {
        const data = typeof message === "string" ? JSON.parse(message as string) : message;
        if (data.type === "subscribe_trip" && data.tripId) {
          const userId = (ws as any)._userId;
          if (userId) subscribeToTrip(data.tripId, userId);
        }
      } catch {}
    },
    close(ws) {
      const userId = (ws as any)._userId;
      if (userId) unsubscribe(userId);
    },
  });
