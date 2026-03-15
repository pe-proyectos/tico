import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

if (!process.env.JWT_SECRET) {
  console.warn("⚠️  JWT_SECRET not set — using default. Set JWT_SECRET env var in production!");
}
const JWT_SECRET = process.env.JWT_SECRET || "tico-jwt-secret-2026";

export function signToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30d" });
}

export async function getUserFromToken(authorization?: string) {
  if (!authorization?.startsWith("Bearer ")) return null;
  try {
    const payload = jwt.verify(authorization.slice(7), JWT_SECRET) as { userId: string };
    return await prisma.user.findUnique({ where: { id: payload.userId }, include: { driver: true } });
  } catch {
    return null;
  }
}

export type AuthUser = NonNullable<Awaited<ReturnType<typeof getUserFromToken>>>;
