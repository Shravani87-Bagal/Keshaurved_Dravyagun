import dotenv from 'dotenv';
import { pool } from '../src/db/pool.js';
import { buildSearchQuery } from '../src/services/scoring/buildSearchQuery.js';
import { getScoringWeights } from '../src/services/scoring/weightsCache.js';
import { resolveSearchFilters } from '../src/services/scoring/resolveFilters.js';

dotenv.config();

const filters = {
  rasa: ['Tikta'],
  guna: ['Laghu'],
  karma: ['Rasayana', 'Balya'],
  indication: ['jwar'],
  virya: ['Ushna'],
  dosha: ['Vata · Decreases', 'Pitta · Decreases'],
};

async function main() {
  const criteria = await resolveSearchFilters(filters);
  const weights = await getScoringWeights();
  const { sql, params } = buildSearchQuery(criteria, weights, {
    statuses: ['reviewed', 'verified'],
    limit: 50,
    offset: 0,
  });

  const explain = await pool.query(
    `EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT) ${sql}`,
    params
  );

  console.log(explain.rows.map((r) => r['QUERY PLAN']).join('\n'));
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
