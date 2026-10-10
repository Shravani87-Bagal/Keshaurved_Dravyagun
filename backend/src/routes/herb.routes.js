import { Router } from 'express';
import { z } from 'zod';
import { authenticate, requireRole } from '../middleware/auth.js';
import {
  listHerbs,
  getHerbById,
  createHerb,
  updateHerb,
  verifyHerb,
  deleteHerb,
} from '../services/herbs/herbService.js';

export const herbRouter = Router();

// Validation schemas
const herbQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['draft', 'reviewed', 'verified', 'archived']).optional(),
});

const herbCreateSchema = z.object({
  code: z.string().min(1),
  english_name: z.string().min(1),
  sanskrit_name: z.string().optional(),
  botanical_name: z.string().optional(),
  local_name: z.string().optional(),
  family: z.string().optional(),
  part_used: z.string().optional(),
  prabhava: z.string().optional(),
  virya: z.string().optional(),
  vipaka: z.string().optional(),
  rasa: z.array(z.string()).optional(),
  guna: z.array(z.string()).optional(),
  karma: z.array(z.string()).optional(),
  indications: z.array(z.string()).optional(),
  dosha_actions: z.record(z.enum(['vata', 'pitta', 'kapha']), z.enum(['pacifies', 'increases'])).optional(),
  dhatu: z.record(z.string(), z.coerce.number().int().min(0).max(5)).optional(),
  mala: z.record(z.string(), z.enum(['increases', 'decreases'])).optional(),
  srotas: z.array(z.string()).optional(),
  avayava: z.array(z.string()).optional(),
  raw_karma: z.string().optional(),
  raw_indication: z.string().optional(),
});

const herbUpdateSchema = herbCreateSchema.partial().extend({
  status: z.enum(['draft', 'reviewed', 'verified', 'archived']).optional(),
});

// GET /api/herbs - paginated list with status filter
herbRouter.get('/', authenticate, async (req, res, next) => {
  try {
    const query = herbQuerySchema.parse(req.query);
    const user = req.user;

    // Clinicians only see reviewed/verified
    let allowedStatuses = query.status ? [query.status] : ['draft', 'reviewed', 'verified', 'archived'];
    if (user.role === 'clinician') {
      allowedStatuses = query.status ? [query.status] : ['reviewed', 'verified'];
      if (query.status && !['reviewed', 'verified'].includes(query.status)) {
        return res.status(403).json({ error: 'Clinicians can only view reviewed or verified herbs' });
      }
    }

    const result = await listHerbs({
      page: query.page,
      limit: query.limit,
      statuses: allowedStatuses,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/herbs/:id - full profile
herbRouter.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const herb = await getHerbById(id, user.role);
    if (!herb) {
      return res.status(404).json({ error: 'Herb not found' });
    }
    res.json(herb);
  } catch (err) {
    next(err);
  }
});

// POST /api/herbs - create herb (editor+)
herbRouter.post('/', authenticate, requireRole('editor', 'admin'), async (req, res, next) => {
  try {
    const body = herbCreateSchema.parse(req.body);
    const herb = await createHerb(body, req.user);
    res.status(201).json(herb);
  } catch (err) {
    next(err);
  }
});

// PUT /api/herbs/:id - update herb (editor+)
herbRouter.put('/:id', authenticate, requireRole('editor', 'admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = herbUpdateSchema.parse(req.body);
    const herb = await updateHerb(id, body, req.user);
    if (!herb) {
      return res.status(404).json({ error: 'Herb not found' });
    }
    res.json(herb);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/herbs/:id - partial update (editor+)
herbRouter.patch('/:id', authenticate, requireRole('editor', 'admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = herbUpdateSchema.parse(req.body);
    const herb = await updateHerb(id, body, req.user);
    if (!herb) {
      return res.status(404).json({ error: 'Herb not found' });
    }
    res.json(herb);
  } catch (err) {
    next(err);
  }
});

// POST /api/herbs/:id/verify - verify herb (domain_expert+)
herbRouter.post('/:id/verify', authenticate, requireRole('domain_expert', 'admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const herb = await verifyHerb(id, req.user);
    if (!herb) {
      return res.status(404).json({ error: 'Herb not found' });
    }
    res.json(herb);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/herbs/:id - soft delete (admin only)
herbRouter.delete('/:id', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const herb = await deleteHerb(id, req.user);
    if (!herb) {
      return res.status(404).json({ error: 'Herb not found' });
    }
    res.json(herb);
  } catch (err) {
    next(err);
  }
});
