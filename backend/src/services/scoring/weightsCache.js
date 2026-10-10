import { pool } from '../../db/pool.js';

/**
 * In-memory scoring weights cache.
 * NOTE: When scaling to multiple app instances behind a load balancer,
 * move this cache to Redis so all instances share invalidation.
 */
const TTL_MS = 60_000;

let cachedWeights = null;
let cachedAt = 0;

export async function getScoringWeights() {
  const now = Date.now();
  if (cachedWeights && now - cachedAt < TTL_MS) {
    return cachedWeights;
  }

  const { rows } = await pool.query(
    `SELECT parameter_group, weight::float AS weight FROM scoring_weights`
  );

  cachedWeights = Object.fromEntries(
    rows.map((row) => [row.parameter_group, row.weight])
  );
  cachedAt = now;
  return cachedWeights;
}

export function invalidateScoringWeightsCache() {
  cachedWeights = null;
  cachedAt = 0;
}
