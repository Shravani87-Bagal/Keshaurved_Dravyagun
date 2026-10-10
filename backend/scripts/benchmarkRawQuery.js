/**
 * Benchmark raw SQL query directly to isolate performance.
 */
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 100 });

const SQL = `
SELECT
  h.id,
  h.code,
  h.english_name,
  h.botanical_name,
  h.part_used,
  h.prabhava,
  h.status,
  h.image_url,
  CAST(
    ROUND(
      CASE WHEN $11 > 0
        THEN 100.0 * (
          COALESCE(rasa_lat.ratio, 0) * 1.0 +
          COALESCE(guna_lat.ratio, 0) * 1.0 +
          COALESCE(karma_lat.ratio, 0) * 1.0 +
          COALESCE(indication_lat.ratio, 0) * 1.0 +
          COALESCE(virya_lat.ratio, 0) * 1.0 +
          COALESCE(dosha_lat.ratio, 0) * 1.0
        ) / $11
        ELSE 0
      END
    ) AS numeric(10,1)
  ) AS match_percentage
FROM herbs h
LEFT JOIN LATERAL (
  SELECT
    COUNT(*) FILTER (WHERE j.rasa_id IS NOT NULL)::float
      / NULLIF(cardinality($1::int[]), 0) AS ratio
  FROM unnest($1::int[]) AS sel(rasa_id)
  LEFT JOIN herb_rasa j ON j.herb_id = h.id AND j.rasa_id = sel.rasa_id
) rasa_lat ON cardinality($1::int[]) > 0
LEFT JOIN LATERAL (
  SELECT
    COUNT(*) FILTER (WHERE j.guna_id IS NOT NULL)::float
      / NULLIF(cardinality($2::int[]), 0) AS ratio
  FROM unnest($2::int[]) AS sel(guna_id)
  LEFT JOIN herb_guna j ON j.herb_id = h.id AND j.guna_id = sel.guna_id
) guna_lat ON cardinality($2::int[]) > 0
LEFT JOIN LATERAL (
  SELECT
    COUNT(*) FILTER (WHERE j.karma_id IS NOT NULL)::float
      / NULLIF(cardinality($3::int[]), 0) AS ratio
  FROM unnest($3::int[]) AS sel(karma_id)
  LEFT JOIN herb_karma j ON j.herb_id = h.id AND j.karma_id = sel.karma_id
) karma_lat ON cardinality($3::int[]) > 0
LEFT JOIN LATERAL (
  SELECT
    COUNT(*) FILTER (WHERE j.indication_id IS NOT NULL)::float
      / NULLIF(cardinality($4::int[]), 0) AS ratio
  FROM unnest($4::int[]) AS sel(indication_id)
  LEFT JOIN herb_indications j ON j.herb_id = h.id AND j.indication_id = sel.indication_id
) indication_lat ON cardinality($4::int[]) > 0
LEFT JOIN LATERAL (
  SELECT
    CASE WHEN h.virya_id = $5 THEN 1.0 ELSE 0.0 END AS ratio
  FROM virya_terms vt
  WHERE vt.id = $5
) virya_lat ON true
LEFT JOIN LATERAL (
  SELECT
    COUNT(*) FILTER (WHERE hda.herb_id IS NOT NULL)::float
      / NULLIF(jsonb_array_length($6::jsonb), 0) AS ratio
  FROM jsonb_to_recordset($6::jsonb) AS sel(dosha dosha_type, effect dosha_effect)
  LEFT JOIN herb_dosha_actions hda
    ON hda.herb_id = h.id
   AND hda.dosha = sel.dosha
   AND hda.effect = sel.effect
) dosha_lat ON jsonb_array_length($6::jsonb) > 0
WHERE h.status = ANY($7::herb_status[])
ORDER BY match_percentage DESC, h.english_name ASC
LIMIT $8 OFFSET $9
`;

async function main() {
  // Get actual term IDs from DB
  const [rasaRows, gunaRows, karmaRows, indicationRows, viryaRows] = await Promise.all([
    pool.query(`SELECT id FROM rasa_terms WHERE canonical_en = 'Tikta'`),
    pool.query(`SELECT id FROM guna_terms WHERE canonical_en = 'Laghu'`),
    pool.query(`SELECT id FROM karma_terms WHERE canonical_en IN ('Rasayana', 'Balya')`),
    pool.query(`SELECT id FROM indication_terms WHERE canonical_en LIKE '%jwar%'`),
    pool.query(`SELECT id FROM virya_terms WHERE canonical_en = 'Ushna'`),
  ]);

  const rasaIds = rasaRows.rows.map(r => r.id);
  const gunaIds = gunaRows.rows.map(r => r.id);
  const karmaIds = karmaRows.rows.map(r => r.id);
  const indicationIds = indicationRows.rows.map(r => r.id);
  const viryaId = viryaRows.rows[0]?.id || 1;

  const params = [
    rasaIds,
    gunaIds,
    karmaIds,
    indicationIds,
    viryaId,
    JSON.stringify([{ dosha: 'vata', effect: 'pacifies' }, { dosha: 'pitta', effect: 'pacifies' }]),
    ['reviewed', 'verified'],
    50,
    0,
    6.0, // activeWeightSum
  ];

  console.log('Warming up...');
  await pool.query(SQL, params);

  console.log('Benchmarking raw SQL (200 iterations)...');
  const samples = [];
  for (let i = 0; i < 200; i++) {
    const start = process.hrtime.bigint();
    await pool.query(SQL, params);
    const duration = Number(process.hrtime.bigint() - start) / 1e6;
    samples.push(duration);
  }

  samples.sort((a, b) => a - b);
  const avg = samples.reduce((s, v) => s + v, 0) / samples.length;
  const p95 = samples[Math.floor(samples.length * 0.95) - 1];
  const p99 = samples[Math.floor(samples.length * 0.99) - 1];

  console.log(`\nRaw SQL Results:`);
  console.log(`Avg: ${avg.toFixed(2)} ms`);
  console.log(`P95: ${p95.toFixed(2)} ms`);
  console.log(`P99: ${p99.toFixed(2)} ms`);

  await pool.end();
}

main().catch(console.error);
