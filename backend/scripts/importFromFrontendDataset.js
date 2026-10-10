/**
 * Dev-only bootstrap: imports herbs from the React mock dataset into normalized PostgreSQL.
 * Mala uses 0–5 scores only; mock "Purisha: Decreases" rows are skipped and reported.
 */
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import pg from 'pg';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const reportPath = path.join(__dirname, 'import-report.json');

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const TERM_TABLES = {
  rasa: 'rasa_terms',
  guna: 'guna_terms',
  karma: 'karma_terms',
  indication: 'indication_terms',
  virya: 'virya_terms',
  vipaka: 'vipaka_terms',
  dhatu: 'dhatu_terms',
  mala: 'mala_terms',
  srotas: 'srotas_terms',
  avayava: 'avayava_terms',
};

const report = {
  importedAt: new Date().toISOString(),
  herbsProcessed: 0,
  herbsInserted: 0,
  errors: [],
  warnings: [],
  skippedMalaMockFormat: [],
  srotasDefaultScoreApplied: [],
  duplicateCodes: [],
};

function slugify(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

function mapHerbStatus(raw, defaultStatus) {
  const v = String(raw || '').toLowerCase();
  if (v === 'verified') return 'verified';
  if (v === 'reviewed') return 'reviewed';
  if (v === 'archived') return 'archived';
  if (v === 'draft') return defaultStatus;
  return defaultStatus;
}

function mapDoshaEffect(action) {
  const a = String(action || '').toLowerCase();
  if (a === 'increases' || a === 'increase') return 'increases';
  if (a === 'decreases' || a === 'decrease') return 'pacifies';
  return null;
}

function parseScoredAffinity(raw) {
  const s = String(raw).trim();
  const m = s.match(/^(.+?)\s*\((\d+)\)\s*$/);
  if (m) {
    const score = Number(m[2]);
    if (score >= 0 && score <= 5) {
      return { term: m[1].trim(), score };
    }
  }
  return { term: s, score: null, plain: true };
}

function parseMalaEntry(raw, herbCode) {
  const s = String(raw).trim();
  const mockDirection = s.match(/^(.+?):\s*(Increases|Decreases)\s*$/i);
  if (mockDirection) {
    report.skippedMalaMockFormat.push({
      herbCode,
      value: s,
      message: 'Mock mala direction format skipped; real sheet uses 0–5 scores only.',
    });
    return null;
  }
  return parseScoredAffinity(s);
}

async function ensureTerm(client, vocabulary, label) {
  const table = TERM_TABLES[vocabulary];
  const canonical = String(label).trim();
  if (!canonical) {
    return null;
  }
  const slug = slugify(canonical);
  const { rows } = await client.query(
    `INSERT INTO ${table} (canonical_en, slug)
     VALUES ($1, $2)
     ON CONFLICT (slug) DO UPDATE SET canonical_en = EXCLUDED.canonical_en
     RETURNING id`,
    [canonical, slug]
  );
  return rows[0].id;
}

async function loadHerbDataset() {
  const base = path.resolve(__dirname, '../../src/data/herbs');
  const parts = ['herbsPart1.js', 'herbsPart2.js', 'herbsPart3.js', 'herbsPart4.js'];
  const all = [];
  for (const file of parts) {
    const mod = await import(pathToFileURL(path.join(base, file)).href);
    const chunk = mod.default;
    if (Array.isArray(chunk)) {
      all.push(...chunk);
    }
  }
  return all;
}

async function clearHerbData(client) {
  await client.query(`
    TRUNCATE TABLE
      herb_rasa, herb_guna, herb_karma, herb_indications,
      herb_dhatu, herb_mala, herb_srotas, herb_avayava,
      herb_dosha_actions, herb_regional_names, herb_references,
      herbs
    RESTART IDENTITY CASCADE
  `);
}

async function importHerb(client, herb, defaultStatus) {
  const code = herb.id;
  if (!code) {
    report.errors.push({ message: 'Herb missing id/code', herb });
    return;
  }

  report.herbsProcessed += 1;

  const status = mapHerbStatus(herb.verificationStatus, defaultStatus);

  const viryaId = herb.virya ? await ensureTerm(client, 'virya', herb.virya) : null;
  const vipakaId = herb.vipaka ? await ensureTerm(client, 'vipaka', herb.vipaka) : null;

  let herbRow;
  try {
    const inserted = await client.query(
      `INSERT INTO herbs (
        code, english_name, botanical_name, part_used, prabhava,
        description, image_url, original_language, status, virya_id, vipaka_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'en-IN', $8, $9, $10)
      ON CONFLICT (code) DO UPDATE SET
        english_name = EXCLUDED.english_name,
        botanical_name = EXCLUDED.botanical_name,
        part_used = EXCLUDED.part_used,
        prabhava = EXCLUDED.prabhava,
        status = EXCLUDED.status,
        virya_id = EXCLUDED.virya_id,
        vipaka_id = EXCLUDED.vipaka_id,
        updated_at = now()
      RETURNING id`,
      [
        code,
        herb.englishName || code,
        herb.botanicalName || null,
        herb.partUsed || null,
        herb.prabhava || null,
        null,
        null,
        status,
        viryaId,
        vipakaId,
      ]
    );
    herbRow = inserted.rows[0];
  } catch (err) {
    if (err.code === '23505') {
      report.duplicateCodes.push(code);
    }
    report.errors.push({ herbCode: code, error: err.message });
    return;
  }

  const herbId = herbRow.id;

  await client.query(`DELETE FROM herb_regional_names WHERE herb_id = $1`, [herbId]);
  for (const name of herb.regionalNames || []) {
    if (name) {
      await client.query(
        `INSERT INTO herb_regional_names (herb_id, name) VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [herbId, String(name).trim()]
      );
    }
  }

  const linkMulti = async (table, col, vocabulary, values) => {
    await client.query(`DELETE FROM ${table} WHERE herb_id = $1`, [herbId]);
    for (const v of values || []) {
      const termId = await ensureTerm(client, vocabulary, v);
      if (termId) {
        await client.query(
          `INSERT INTO ${table} (herb_id, ${col}) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [herbId, termId]
        );
      }
    }
  };

  await linkMulti('herb_rasa', 'rasa_id', 'rasa', herb.rasa);
  await linkMulti('herb_guna', 'guna_id', 'guna', herb.guna);
  await linkMulti('herb_karma', 'karma_id', 'karma', herb.karma);
  await linkMulti('herb_indications', 'indication_id', 'indication', herb.indications);

  const linkScored = async (table, col, vocabulary, entries, parser) => {
    await client.query(`DELETE FROM ${table} WHERE herb_id = $1`, [herbId]);
    for (const raw of entries || []) {
      const parsed = parser(raw, code);
      if (!parsed) {
        continue;
      }
      let { term, score } = parsed;
      if (score == null && parsed.plain) {
        if (vocabulary === 'srotas') {
          score = 4;
          report.srotasDefaultScoreApplied.push({ herbCode: code, term, score });
        } else {
          report.warnings.push({
            herbCode: code,
            vocabulary,
            value: raw,
            message: 'Missing numeric score; row skipped for scored affinity.',
          });
          continue;
        }
      }
      const termId = await ensureTerm(client, vocabulary, term);
      if (termId) {
        await client.query(
          `INSERT INTO ${table} (herb_id, ${col}, score) VALUES ($1, $2, $3)
           ON CONFLICT (herb_id, ${col}) DO UPDATE SET score = EXCLUDED.score`,
          [herbId, termId, score]
        );
      }
    }
  };

  await linkScored('herb_dhatu', 'dhatu_id', 'dhatu', herb.dhatu, (raw) =>
    parseScoredAffinity(raw)
  );
  await linkScored('herb_mala', 'mala_id', 'mala', herb.mala, parseMalaEntry);
  await linkScored('herb_srotas', 'srotas_id', 'srotas', herb.srotas, (raw) =>
    parseScoredAffinity(raw)
  );
  await linkScored('herb_avayava', 'avayava_id', 'avayava', herb.avayava, (raw) =>
    parseScoredAffinity(raw)
  );

  await client.query(`DELETE FROM herb_dosha_actions WHERE herb_id = $1`, [herbId]);
  if (herb.dosha && typeof herb.dosha === 'object') {
    for (const [dosha, action] of Object.entries(herb.dosha)) {
      const effect = mapDoshaEffect(action);
      const d = dosha.toLowerCase();
      if (effect && ['vata', 'pitta', 'kapha'].includes(d)) {
        await client.query(
          `INSERT INTO herb_dosha_actions (herb_id, dosha, effect) VALUES ($1, $2, $3)
           ON CONFLICT (herb_id, dosha) DO UPDATE SET effect = EXCLUDED.effect`,
          [herbId, d, effect]
        );
      }
    }
  }

  report.herbsInserted += 1;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required');
  }

  const fresh = process.argv.includes('--fresh');
  const defaultStatus = process.env.IMPORT_DEFAULT_STATUS || 'reviewed';

  const herbs = await loadHerbDataset();
  console.log(`Loaded ${herbs.length} herbs from frontend dataset`);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    if (fresh) {
      console.log('Truncating existing herb data (--fresh)...');
      await clearHerbData(client);
    }

    for (const herb of herbs) {
      await importHerb(client, herb, defaultStatus);
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`Import complete: ${report.herbsInserted}/${report.herbsProcessed} herbs`);
  console.log(`Report written to ${reportPath}`);
  if (report.skippedMalaMockFormat.length) {
    console.log(
      `Skipped ${report.skippedMalaMockFormat.length} mock mala direction entries (see report)`
    );
  }
  if (report.errors.length) {
    console.warn(`${report.errors.length} errors — see import-report.json`);
  }

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
