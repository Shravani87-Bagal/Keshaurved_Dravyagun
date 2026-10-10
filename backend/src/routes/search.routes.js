import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import {
  logSearchEvent,
  runDetailedSearch,
  runSimpleSearch,
} from '../services/scoring/searchService.js';

const langSchema = z.enum(['en-IN', 'hi-IN', 'mr-IN', 'sa-IN']).optional();

const filtersSchema = z.object({
  rasa: z.array(z.string()).optional(),
  guna: z.array(z.string()).optional(),
  karma: z.array(z.string()).optional(),
  indication: z.array(z.string()).optional(),
  virya: z.array(z.string()).optional(),
  vipaka: z.array(z.string()).optional(),
  dhatu: z.array(z.string()).optional(),
  mala: z.array(z.string()).optional(),
  srotas: z.array(z.string()).optional(),
  avayava: z.array(z.string()).optional(),
  dosha: z.array(z.string()).optional(),
  prabhava: z.array(z.string()).optional(),
});

const detailedSchema = z.object({
  filters: filtersSchema.default({}),
  lang: langSchema,
  limit: z.number().int().min(1).max(200).optional(),
  offset: z.number().int().min(0).optional(),
});

const simpleSchema = z.object({
  query: z.string().min(1),
  lang: langSchema,
  limit: z.number().int().min(1).max(200).optional(),
  offset: z.number().int().min(0).optional(),
});

export const searchRouter = Router();

searchRouter.use(authenticate);

searchRouter.post('/detailed', async (req, res, next) => {
  try {
    const body = detailedSchema.parse(req.body);
    const { results, meta } = await runDetailedSearch({
      filters: body.filters,
      role: req.user.role,
      limit: body.limit ?? 50,
      offset: body.offset ?? 0,
    });

    const topMatch = results[0]?.matchPercentage ?? 0;
    // Fire and forget - don't await analytics logging
    logSearchEvent({
      userId: req.user.id,
      mode: 'detailed',
      filtersJson: body.filters,
      lang: body.lang,
      resultCount: results.length,
      topMatchPct: topMatch,
      dbDurationMs: meta.dbDurationMs,
    }).catch(err => console.error('Search event logging failed:', err));

    res.json({
      lang: body.lang ?? 'en-IN',
      results,
      meta,
    });
  } catch (err) {
    next(err);
  }
});

searchRouter.post('/simple', async (req, res, next) => {
  try {
    const body = simpleSchema.parse(req.body);
    const { results, meta } = await runSimpleSearch({
      query: body.query,
      role: req.user.role,
      limit: body.limit ?? 50,
      offset: body.offset ?? 0,
    });

    const topMatch = results[0]?.matchPercentage ?? 0;
    // Fire and forget - don't await analytics logging
    logSearchEvent({
      userId: req.user.id,
      mode: 'simple',
      queryText: body.query,
      lang: body.lang,
      resultCount: results.length,
      topMatchPct: topMatch,
      dbDurationMs: meta.dbDurationMs,
    }).catch(err => console.error('Search event logging failed:', err));

    res.json({
      lang: body.lang ?? 'en-IN',
      results,
      meta,
    });
  } catch (err) {
    next(err);
  }
});
