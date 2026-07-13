import rateLimit from "express-rate-limit";

// Tighter limit on auth routes specifically, per docs/06-security.md
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts, please try again later" },
});
