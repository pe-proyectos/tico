import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { authRoutes } from "./routes/auth";
import { tripRoutes } from "./routes/trips";
import { driverRoutes } from "./routes/driver";
import { adminRoutes } from "./routes/admin";
import { userRoutes } from "./routes/users";

const port = Number(process.env.PORT) || 3000;

const app = new Elysia()
  .use(cors({ origin: ['https://tico.luminari.agency', 'http://localhost:5173'] }))
  .get("/health", () => ({ ok: true, service: "tico-api", time: new Date().toISOString() }))
  .get("/api/health", () => ({ ok: true, service: "tico-api", time: new Date().toISOString() }))
  .use(authRoutes)
  .use(tripRoutes)
  .use(driverRoutes)
  .use(adminRoutes)
  .use(userRoutes)
  .listen(port);

console.log(`🚕 Tico API running on port ${port}`);

export type App = typeof app;
