/**
 * Duplicates existing herbs (and junction rows) until at least TARGET_COUNT reviewed herbs exist.
 * Dev-only helper when the frontend mock set has fewer than 300 rows.
 */
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const TARGET = Number(process.env.BENCHMARK_HERB_TARGET || 320);

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function cloneHerb(client, sourceId, newCode) {
  const { rows } = await client.query(
    `INSERT INTO herbs (
      code, english_name, botanical_name, part_used, prabhava, description,
      image_url, original_language, status, virya_id, vipaka_id
    )
    SELECT $2, english_name || ' (bench)', botanical_name, part_used, prabhava,
           description, image_url, original_language, status, virya_id, vipaka_id
    FROM herbs WHERE id = $1
    RETURNING id`,
    [sourceId, newCode]
  );
  const newId = rows[0].id;

  const copy = async (table, cols) => {
    await client.query(
      `INSERT INTO ${table} (${cols})
       SELECT $2, ${cols.split(', ').slice(1).join(', ')}
       FROM ${table} WHERE herb_id = $1
       ON CONFLICT DO NOTHING`,
      [sourceId, newId]
    );
  };

  await copy('herb_regional_names', 'herb_id, name');
  await copy('herb_rasa', 'herb_id, rasa_id');
  await copy('herb_guna', 'herb_id, guna_id');
  await copy('herb_karma', 'herb_id, karma_id');
  await copy('herb_indications', 'herb_id, indication_id');
  await copy('herb_dhatu', 'herb_id, dhatu_id, score');
  await copy('herb_mala', 'herb_id, mala_id, score');
  await copy('herb_srotas', 'herb_id, srotas_id, score');
  await copy('herb_avayava', 'herb_id, avayava_id, score');
  await copy('herb_dosha_actions', 'herb_id, dosha, effect');
}

async function main() {
  const client = await pool.connect();
  try {
    const { rows: countRows } = await client.query(
      `SELECT COUNT(*)::int AS n FROM herbs WHERE status IN ('reviewed', 'verified')`
    );
    let n = countRows[0].n;
    if (n >= TARGET) {
      console.log(`Already ${n} herbs (target ${TARGET})`);
      return;
    }

    const { rows: sources } = await client.query(
      `SELECT id, code FROM herbs WHERE status IN ('reviewed', 'verified') ORDER BY code`
    );

    await client.query('BEGIN');
    let cloneIndex = 0;
    while (n < TARGET) {
      const src = sources[cloneIndex % sources.length];
      cloneIndex += 1;
      const newCode = `${src.code}_BENCH_${String(cloneIndex).padStart(4, '0')}`;
      await cloneHerb(client, src.id, newCode);
      n += 1;
    }
    await client.query('COMMIT');
    console.log(`Scaled to ${n} reviewed/verified herbs`);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
