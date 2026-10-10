import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { loginUser, registerUser } from '../services/auth/authService.js';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authRouter = Router();

authRouter.post('/register', async (req, res, next) => {
  try {
    const body = registerSchema.parse(req.body);
    const user = await registerUser(body);
    res.status(201).json({ user });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    next(err);
  }
});

authRouter.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);
    const result = await loginUser(body);
    if (!result) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
});

authRouter.post('/password-reset/request', (_req, res) => {
  res.status(501).json({
    error: 'Password reset email is not configured',
    message: 'Scaffold only — wire SMTP and token delivery in production.',
  });
});
