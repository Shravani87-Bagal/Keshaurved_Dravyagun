import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import {
  getScoringWeights,
  invalidateScoringWeightsCache,
} from '../services/scoring/weightsCache.js';
import { ROLES } from '../utils/roles.js';

export const weightsRouter = Router();

weightsRouter.get('/', authenticate, async (_req, res, next) => {
  try {
    const weights = await getScoringWeights();
    res.json({ weights });
  } catch (err) {
    next(err);
  }
});

const updateSchema = z.object({
  parameterGroup: z.string().min(1),
  weight: z.number().positive(),
});

weightsRouter.put(
  '/',
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.DOMAIN_EXPERT),
  async (req, res, next) => {
    try {
      const body = updateSchema.parse(req.body);
      await pool.query(
        `UPDATE scoring_weights
         SET weight = $1, updated_by = $2, updated_at = now()
         WHERE parameter_group = $3`,
        [body.weight, req.user.id, body.parameterGroup]
      );
      invalidateScoringWeightsCache();
      const weights = await getScoringWeights();
      res.json({ weights });
    } catch (err) {
      next(err);
    }
  }
);
