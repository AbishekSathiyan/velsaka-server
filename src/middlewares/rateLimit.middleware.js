import rateLimit from "express-rate-limit";

export const waitlistLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
export const otpLimiter = rateLimit({ windowMs: 5 * 60 * 1000, max: 3 });