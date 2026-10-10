/**
 * Real import from Dataset/herbs.xlsx
 * Single transaction, idempotent upsert on record_id, stores raw text, writes vocab_review.csv
 */
import dotenv from 'dotenv';
import xlsx from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXCEL_PATH = path.join(__dirname, '../../Dataset/herbs.xlsx');
const REVIEW_CSV_PATH = path.join(__dirname, 'vocab_review.csv');

// Standard closed vocabularies
const STANDARD_VOCABULARIES = {
  rasa: ['Madhura', 'Amla', 'Lavana', 'Katu', 'Tikta', 'Kashaya'],
  guna: [
    'Guru', 'Laghu', 'Snigdha', 'Ruksha', 'Ushna', 'Sheeta',
    'Sukshma', 'Sthula', 'Sandra', 'Drava', 'Mridu', 'Kathina',
    'Sara', 'Picchila', 'Manda', 'Vyavayi', 'Vishada', 'Tikshna'
  ],
  dosha: ['Vata', 'Pitta', 'Kapha'],
  karma: [
    'Deepana', 'Pachana', 'Rasayana', 'Balya', 'Ropana', 'Varnya',
    'Jvaraghna', 'Krimighna', 'Kandughna', 'Kusthaghna', 'Pittashamak',
    'Kaphashamak', 'Vatashamak', 'Vatakaphashamak', 'Pittakaphashamak',
    'Vadapittashamak', 'Medhya', 'Vrishya', 'Anulomana', 'Grahi', 'Mutrala',
    'Rechana', 'Vatanuloman', 'Dahashamak', 'Vishaghna', 'Tridoshhar'
  ],
  srotas: [
    'Pranavaha', 'Annavaha', 'Udakavaha', 'Rasavaha', 'Raktavaha',
    'Mamsavaha', 'Medovaha', 'Asthivaha', 'Majjavaha', 'Shukravaha',
    'Mutravaha', 'Swedavaha', 'Purishavaha', 'Artavavaha'
  ],
  virya: ['Ushna', 'Sheeta'],
  vipaka: ['Madhura', 'Amla', 'Katu'],
  mala: ['Purisha', 'Mutra', 'Sveda'],
  dhatu: ['Rasa', 'Rakta', 'Mamsa', 'Meda', 'Asthi', 'Majja', 'Shukra'],
};

const ALIASES = {
  rasa: { 'kashay': 'Kashaya', 'lavana': 'Lavan' },
  guna: { 'sar': 'Sara' },
};

function normalizeToken(token) {
  if (!token) return null;
  return String(token)
    .trim()
    .toLowerCase()
    .replace(/[,\s;.\/\n]+/g, ' ')
    .trim();
}

function matchCanonical(category, rawToken) {
  const normalized = normalizeToken(rawToken);
  if (!normalized) return null;

  const aliasMap = ALIASES[category];
  if (aliasMap) {
    for (const [alias, canonical] of Object.entries(aliasMap)) {
      if (normalizeToken(alias) === normalized) {
        return canonical;
      }
    }
  }

  const standards = STANDARD_VOCABULARIES[category] || [];
  for (const term of standards) {
    if (normalizeToken(term) === normalized) {
      return term;
    }
  }

  return null;
}

function parseDoshaEffect(raw) {
  if (!raw) return null;
  const normalized = raw.trim().toLowerCase();
  if (normalized === 'decreases' || normalized === 'pacifies') {
    return 'pacifies';
  }
  if (normalized === 'increases') {
    return 'increases';
  }
  return null;
}

function parseMalaEffect(raw) {
  if (!raw) return null;
  const normalized = raw.trim().toLowerCase();
  if (normalized === 'decreases') {
    return 'decreases';
  }
  if (normalized === 'increases') {
    return 'increases';
  }
  return null;
}

function parseScore(raw) {
  if (raw === null || raw === undefined || raw === '') return null;
  const num = parseInt(raw, 10);
  if (isNaN(num) || num < 0 || num > 5) return null;
  return num;
}

function parseYesNo(raw) {
  if (!raw) return false;
  const normalized = String(raw).trim().toLowerCase();
  return normalized === 'yes' || normalized === 'true' || normalized === '1';
}

function mergeKarma(importantKarma, otherKarma) {
  const merged = [];
  if (importantKarma) {
    const important = String(importantKarma).split(',').map(s => s.trim()).filter(Boolean);
    merged.push(...important);
  }
  if (otherKarma) {
    const other = String(otherKarma).split(',').map(s => s.trim()).filter(Boolean);
    merged.push(...other);
  }
  return [...new Set(merged)];
}

function simpleTrigramSimilarity(a, b) {
  const ngramsA = new Set();
  const ngramsB = new Set();
  const strA = a.toLowerCase();
  const strB = b.toLowerCase();

  for (let i = 0; i < strA.length - 2; i++) {
    ngramsA.add(strA.slice(i, i + 3));
  }
  for (let i = 0; i < strB.length - 2; i++) {
    ngramsB.add(strB.slice(i, i + 3));
  }

  const intersection = new Set([...ngramsA].filter(x => ngramsB.has(x)));
  const union = new Set([...ngramsA, ...ngramsB]);

  return union.size === 0 ? 0 : intersection.size / union.size;
}

async function importRealDataset() {
  console.log(`Reading Excel file: ${EXCEL_PATH}`);
  const workbook = xlsx.readFile(EXCEL_PATH);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rawData = xlsx.utils.sheet_to_json(worksheet, { defval: null });

  console.log(`\n=== Sheet: ${sheetName} ===`);
  console.log(`Total rows: ${rawData.length}`);

  if (rawData.length === 0) {
    console.error('No data found in Excel file');
    return;
  }

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
  const client = await pool.connect();

  try {
    console.log('Starting transaction...');
    await client.query('BEGIN');

    // Load term IDs
    const termIds = {};
    for (const [category, table] of [
      ['rasa', 'rasa_terms'],
      ['guna', 'guna_terms'],
      ['karma', 'karma_terms'],
      ['indication', 'indication_terms'],
      ['virya', 'virya_terms'],
      ['vipaka', 'vipaka_terms'],
      ['mala', 'mala_terms'],
      ['dhatu', 'dhatu_terms'],
      ['srotas', 'srotas_terms'],
    ]) {
      const { rows } = await client.query(`SELECT id, canonical_en FROM ${table}`);
      termIds[category] = {};
      for (const row of rows) {
        termIds[category][row.canonical_en.toLowerCase()] = row.id;
      }
    }

    const reviewCsv = [];
    const unknownTerms = {
      karma: new Map(),
      indication: new Map(),
    };

    let reviewedCount = 0;
    let draftCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      const rowNum = i + 2;

      const code = row['record_id'];
      const englishName = row['English Name'];
      const sanskritName = row['Sanskrit Name'];
      const botanicalName = row['Botanical Name'];
      const localName = row['Local Name'];
      const family = row['Family'];
      const partUsed = row['Part Used'];
      const prabhava = row['Prabhava'];

      // Quality flags
      const missingIdentity = row['quality_missing_identity'] === true || row['quality_missing_identity'] === 'true';
      const duplicateBotanical = row['quality_duplicate_botanical'] === true || row['quality_duplicate_botanical'] === 'true';
      const conflictingDuplicate = row['quality_has_conflicting_duplicate'] === true || row['quality_has_conflicting_duplicate'] === 'true';

      // Status determination
      let status = 'draft';
      if (!missingIdentity && !duplicateBotanical && !conflictingDuplicate) {
        status = 'reviewed';
      }

      // Missing identity check
      if (!englishName && !sanskritName) {
        skippedCount++;
        continue;
      }

      // Use Sanskrit name as English name if English is null
      const finalEnglishName = englishName || sanskritName;

      if (status === 'reviewed') {
        reviewedCount++;
      } else {
        draftCount++;
      }

      // Parse and normalize terms
      const mergedKarma = mergeKarma(row['Important Karma'], row['Other Karma']);
      const karmas = mergedKarma.map(k => k.trim()).filter(Boolean);

      const indications = String(row['Major Diseases'] || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const rasas = String(row['Rasa'] || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const gunas = String(row['Guna'] || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const virya = row['Virya'] ? row['Virya'].trim() : null;
      const vipaka = row['Vipaka'] ? row['Vipaka'].trim() : null;

      // Match terms
      const matchTerm = (category, token) => {
        const canonical = matchCanonical(category, token);
        if (canonical && termIds[category][canonical.toLowerCase()]) {
          return termIds[category][canonical.toLowerCase()];
        }
        return null;
      };

      const rasaIds = [...new Set(rasas.map(r => matchTerm('rasa', r)).filter(Boolean))];
      const gunaIds = [...new Set(gunas.map(g => matchTerm('guna', g)).filter(Boolean))];
      const viryaId = virya ? matchTerm('virya', virya) : null;
      const vipakaId = vipaka ? matchTerm('vipaka', vipaka) : null;

      // For open vocabularies, track unknown but don't link
      const karmaIds = [...new Set(karmas.map(karma => {
        const canonical = matchCanonical('karma', karma);
        if (canonical && termIds.karma[canonical.toLowerCase()]) {
          return termIds.karma[canonical.toLowerCase()];
        } else {
          const normalized = normalizeToken(karma);
          if (!unknownTerms.karma.has(normalized)) {
            unknownTerms.karma.set(normalized, { raw: karma, count: 0 });
          }
          unknownTerms.karma.get(normalized).count++;
          return null;
        }
      }).filter(Boolean))];

      const indicationIds = [...new Set(indications.map(indication => {
        const canonical = matchCanonical('indication', indication);
        if (canonical && termIds.indication[canonical.toLowerCase()]) {
          return termIds.indication[canonical.toLowerCase()];
        } else {
          const normalized = normalizeToken(indication);
          if (!unknownTerms.indication.has(normalized)) {
            unknownTerms.indication.set(normalized, { raw: indication, count: 0 });
          }
          unknownTerms.indication.get(normalized).count++;
          return null;
        }
      }).filter(Boolean))];

      // Dosha actions
      const doshaActions = [];
      const doshaColumns = {
        'Dosha Action [Vata]': 'vata',
        'Dosha Action [Pitta]': 'pitta',
        'Dosha Action [Kapha]': 'kapha',
      };
      for (const [col, dosha] of Object.entries(doshaColumns)) {
        const effect = parseDoshaEffect(row[col]);
        if (effect) {
          doshaActions.push({ dosha, effect });
        }
      }

      // Dhatu Actions
      const dhatuScores = [];
      const dhatuColumns = {
        'Dhatu Action [Rasa]': 'Rasa',
        'Dhatu Action [Rakta]': 'Rakta',
        'Dhatu Action [Mamsa]': 'Mamsa',
        'Dhatu Action [Meda]': 'Meda',
        'Dhatu Action [Asthi]': 'Asthi',
        'Dhatu Action [Majja]': 'Majja',
        'Dhatu Action [Shukra]': 'Shukra',
      };
      for (const [col, tissue] of Object.entries(dhatuColumns)) {
        const score = parseScore(row[col]);
        if (score !== null) {
          const dhatuId = matchTerm('dhatu', tissue);
          if (dhatuId) {
            dhatuScores.push({ dhatuId, score });
          }
        }
      }

      // Mala Actions
      const malaActions = [];
      const malaColumns = {
        'Mala Action [Purisha]': 'Purisha',
        'Mala Action [Mutra]': 'Mutra',
        'Mala Action [Sweda]': 'Sveda',
      };
      for (const [col, mala] of Object.entries(malaColumns)) {
        const effect = parseMalaEffect(row[col]);
        if (effect) {
          const malaId = matchTerm('mala', mala);
          if (malaId) {
            malaActions.push({ malaId, effect });
          }
        }
      }

      // Srotas Actions
      const srotasIds = [];
      const srotasColumns = {
        'Srotas Action [Pranavaha]': 'Pranavaha',
        'Srotas Action [Annavaha]': 'Annavaha',
        'Srotas Action [Udakvaha]': 'Udakavaha',
        'Srotas Action [Rasavaha]': 'Rasavaha',
        'Srotas Action [Raktavaha]': 'Raktavaha',
        'Srotas Action [Mamsavaha]': 'Mamsavaha',
        'Srotas Action [Medovaha]': 'Medovaha',
        'Srotas Action [Asthivaha]': 'Asthivaha',
        'Srotas Action [Majjavaha]': 'Majjavaha',
        'Srotas Action [Shukravaha]': 'Shukravaha',
        'Srotas Action [Mutravaha]': 'Mutravaha',
        'Srotas Action [Swedavaha]': 'Swedavaha',
        'Srotas Action [Purishavaha]': 'Purishavaha',
        'Srotas Action [Artavavaha]': 'Artavavaha',
      };
      for (const [col, srotas] of Object.entries(srotasColumns)) {
        if (parseYesNo(row[col])) {
          const srotasId = matchTerm('srotas', srotas);
          if (srotasId) {
            srotasIds.push(srotasId);
          }
        }
      }

      // Upsert herb
      const herbResult = await client.query(
        `INSERT INTO herbs (code, english_name, sanskrit_name, local_name, family, botanical_name, part_used, prabhava, virya_id, vipaka_id, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (code) DO UPDATE SET
           english_name = $2,
           sanskrit_name = $3,
           local_name = $4,
           family = $5,
           botanical_name = $6,
           part_used = $7,
           prabhava = $8,
           virya_id = $9,
           vipaka_id = $10,
           status = $11
         RETURNING id`,
        [code, finalEnglishName, sanskritName, localName, family, botanicalName, partUsed, prabhava, viryaId, vipakaId, status]
      );

      const herbId = herbResult.rows[0].id;

      // Store raw karma and indication text
      await client.query(
        `UPDATE herbs SET
           raw_karma = $1,
           raw_indication = $2
         WHERE id = $3`,
        [mergedKarma.join(', '), String(row['Major Diseases'] || ''), herbId]
      );

      // Delete existing junctions for this herb
      await client.query('DELETE FROM herb_rasa WHERE herb_id = $1', [herbId]);
      await client.query('DELETE FROM herb_guna WHERE herb_id = $1', [herbId]);
      await client.query('DELETE FROM herb_karma WHERE herb_id = $1', [herbId]);
      await client.query('DELETE FROM herb_indications WHERE herb_id = $1', [herbId]);
      await client.query('DELETE FROM herb_dosha_actions WHERE herb_id = $1', [herbId]);
      await client.query('DELETE FROM herb_dhatu WHERE herb_id = $1', [herbId]);
      await client.query('DELETE FROM herb_mala WHERE herb_id = $1', [herbId]);
      await client.query('DELETE FROM herb_srotas WHERE herb_id = $1', [herbId]);

      // Insert junctions
      for (const rasaId of rasaIds) {
        await client.query('INSERT INTO herb_rasa (herb_id, rasa_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [herbId, rasaId]);
      }

      for (const gunaId of gunaIds) {
        await client.query('INSERT INTO herb_guna (herb_id, guna_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [herbId, gunaId]);
      }

      for (const karmaId of karmaIds) {
        await client.query('INSERT INTO herb_karma (herb_id, karma_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [herbId, karmaId]);
      }

      for (const indicationId of indicationIds) {
        await client.query('INSERT INTO herb_indications (herb_id, indication_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [herbId, indicationId]);
      }

      for (const { dosha, effect } of doshaActions) {
        await client.query('INSERT INTO herb_dosha_actions (herb_id, dosha, effect) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', [herbId, dosha, effect]);
      }

      for (const { dhatuId, score } of dhatuScores) {
        await client.query('INSERT INTO herb_dhatu (herb_id, dhatu_id, score) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', [herbId, dhatuId, score]);
      }

      for (const { malaId, effect } of malaActions) {
        await client.query('INSERT INTO herb_mala (herb_id, mala_id, effect) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', [herbId, malaId, effect]);
      }

      for (const srotasId of srotasIds) {
        await client.query('INSERT INTO herb_srotas (herb_id, srotas_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [herbId, srotasId]);
      }
    }

    // Generate review CSV
    for (const category of ['karma', 'indication']) {
      const unknownMap = unknownTerms[category];
      if (unknownMap instanceof Map && unknownMap.size > 0) {
        const standards = STANDARD_VOCABULARIES[category] || [];
        for (const [normalized, data] of unknownMap.entries()) {
          let bestMatch = '';
          let bestScore = 0;
          for (const standard of standards) {
            const score = simpleTrigramSimilarity(normalized, standard.toLowerCase());
            if (score > bestScore && score > 0.3) {
              bestScore = score;
              bestMatch = standard;
            }
          }

          reviewCsv.push({
            category,
            raw_token: data.raw,
            normalized_form: normalized,
            count: data.count,
            suggestion: bestMatch,
            approved_canonical: '',
          });
        }
      }
    }

    // Sort by count descending
    reviewCsv.sort((a, b) => b.count - a.count);

    // Write review CSV
    const csvHeader = 'category,raw_token,normalized_form,count,suggestion,approved_canonical\n';
    const csvRows = reviewCsv.map(row =>
      `${row.category},"${row.raw_token}","${row.normalized_form}",${row.count},"${row.suggestion}","${row.approved_canonical}"`
    ).join('\n');
    fs.writeFileSync(REVIEW_CSV_PATH, csvHeader + csvRows);

    await client.query('COMMIT');
    console.log('Transaction committed successfully');

    console.log('\n=== Import Summary ===');
    console.log(`Total rows: ${rawData.length}`);
    console.log(`Reviewed: ${reviewedCount}`);
    console.log(`Draft: ${draftCount}`);
    console.log(`Skipped: ${skippedCount}`);
    console.log(`Review CSV written: ${REVIEW_CSV_PATH} (${reviewCsv.length} rows)`);

    console.log('\n=== Top 20 Review CSV Rows ===');
    reviewCsv.slice(0, 20).forEach(row => {
      console.log(`  ${String(row.count).padStart(3)} | ${row.category} | ${row.raw_token} | suggestion: ${row.suggestion || '(no match)'}`);
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Import failed, transaction rolled back:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

importRealDataset().catch((err) => {
  console.error(err);
  process.exit(1);
});
