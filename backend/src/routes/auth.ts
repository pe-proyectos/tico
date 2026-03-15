import { Elysia, t } from "elysia";
import { prisma } from "../lib/prisma";
import { signToken, getUserFromToken } from "../middleware/auth";

// Rate limiting: max 5 OTP requests per phone per 10 minutes
const otpRateLimit = new Map<string, number[]>();
const OTP_RATE_WINDOW = 10 * 60 * 1000; // 10 minutes
const OTP_RATE_MAX = 5;

function checkOtpRateLimit(phone: string): boolean {
  const now = Date.now();
  const timestamps = (otpRateLimit.get(phone) || []).filter(t => now - t < OTP_RATE_WINDOW);
  if (timestamps.length >= OTP_RATE_MAX) return false;
  timestamps.push(now);
  otpRateLimit.set(phone, timestamps);
  return true;
}

export const authRoutes = new Elysia({ prefix: "/api/auth" })
  .get("/me", async ({ headers, set }) => {
    const user = await getUserFromToken(headers.authorization);
    if (!user) { set.status = 401; return { error: "Not authenticated" }; }
    return user;
  })
  .post("/request-otp", async ({ body, set }) => {
    const { phone } = body;

    // Phone validation: must be +51 followed by 9 digits (12 chars total)
    if (!/^\+51\d{9}$/.test(phone)) {
      set.status = 400;
      return { error: "Invalid phone format. Must be +51 followed by 9 digits." };
    }

    // Rate limiting
    if (!checkOtpRateLimit(phone)) {
      set.status = 429;
      return { error: "Too many OTP requests. Try again later." };
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.otpCode.create({ data: { phone, code, expiresAt } });

    return { ok: true };
  }, {
    body: t.Object({ phone: t.String() })
  })

  .post("/verify-otp", async ({ body, set }) => {
    const { phone, code } = body;

    // Test codes only in non-production
    const testCodes = ['1234', '1111', '0000'];
    const isTestCode = process.env.NODE_ENV !== 'production' && testCodes.includes(code);

    if (!isTestCode) {
      const otp = await prisma.otpCode.findFirst({
        where: { phone, code, used: false, expiresAt: { gte: new Date() } },
        orderBy: { expiresAt: "desc" },
      });

      if (!otp) {
        set.status = 401;
        return { error: "Invalid or expired OTP" };
      }

      await prisma.otpCode.update({ where: { id: otp.id }, data: { used: true } });
    }

    // Determine role from test code
    const roleMap: Record<string, 'PASSENGER' | 'DRIVER' | 'ADMIN'> = {
      '1234': 'PASSENGER', '1111': 'DRIVER', '0000': 'ADMIN'
    };
    const role = isTestCode ? roleMap[code] : undefined;

    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await prisma.user.create({ data: { phone, role: role || 'PASSENGER', name: '' } });
    } else if (isTestCode && role && user.role !== role) {
      user = await prisma.user.update({ where: { id: user.id }, data: { role } });
    }

    const token = signToken(user.id);
    return { ok: true, token, user };
  }, {
    body: t.Object({ phone: t.String(), code: t.String() })
  });
