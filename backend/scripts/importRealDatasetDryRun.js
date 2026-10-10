/**
 * Dry run import from Dataset/herbs.xlsx
 * Corrected version with proper quality column parsing, vocabulary seeding, and review CSV generation.
 */
import dotenv from 'dotenv';
import xlsx from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXCEL_PATH = path.join(__dirname, '../../Dataset/herbs.xlsx');

// Standard closed vocabularies from company data sheet
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
    'Vadapittashamak', 'Medhya', 'Vrishya', 'Anulomana'
  ],
  srotas: [
    'Pranavaha', 'Annavaha', 'Udakavaha', 'Rasavaha', 'Raktavaha',
    'Mamsavaha', 'Medovaha', 'Asthivaha', 'Majjavaha', 'Shukravaha',
    'Mutravaha', 'Swedavaha', 'Purishavaha', 'Artavavaha'
  ],
  virya: ['Ushna', 'Sheeta'],
  vipaka: ['Madhura', 'Amla', 'Katu'],
  mala: ['Puresha', 'Mutra', 'Sveda'],
  dhatu: ['Rasa', 'Rakta', 'Mamsa', 'Meda', 'Asthi', 'Majja', 'Shukra'],
};

// Aliases
const ALIASES = {
  rasa: { 'kashay': 'Kashaya', 'lavana': 'Lavan' },
  guna: { 'sar': 'Sara' },
};

// Normalization: case-insensitive, trim whitespace, split on `, ; . /` and newlines
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

  // Check aliases first
  const aliasMap = ALIASES[category];
  if (aliasMap) {
    for (const [alias, canonical] of Object.entries(aliasMap)) {
      if (normalizeToken(alias) === normalized) {
        return canonical;
      }
    }
  }

  // Match against standard vocabulary
  const standards = STANDARD_VOCABULARIES[category] || [];
  for (const term of standards) {
    if (normalizeToken(term) === normalized) {
      return term;
    }
  }

  return null; // No match
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
  return [...new Set(merged)]; // Deduplicate
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

async function seedVocabularies() {
  try {
    console.log('Seeding closed vocabularies...');

    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 5 });

    // Helper to seed a vocabulary table
    async function seedVocab(category, table) {
      const terms = STANDARD_VOCABULARIES[category];
      for (const term of terms) {
        const slug = term.toLowerCase().replace(/\s+/g, '-');
        await pool.query(
          `INSERT INTO ${table} (canonical_en, slug) VALUES ($1, $2)
           ON CONFLICT (canonical_en) DO NOTHING`,
          [term, slug]
        );
      }
      console.log(`  Seeded ${terms.length} ${category} terms`);
    }

    await seedVocab('rasa', 'rasa_terms');
    await seedVocab('guna', 'guna_terms');
    // dosha is an enum, not a table - skip seeding
    await seedVocab('karma', 'karma_terms');
    await seedVocab('srotas', 'srotas_terms');
    await seedVocab('virya', 'virya_terms');
    await seedVocab('vipaka', 'vipaka_terms');
    await seedVocab('mala', 'mala_terms');
    await seedVocab('dhatu', 'dhatu_terms');

    console.log('Vocabulary seeding complete');
    await pool.end();
  } catch (err) {
    console.warn('Database connection failed, skipping vocabulary seeding:', err.message);
    console.warn('Will proceed with dry run parsing only');
  }
}

async function dryRunImport() {
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

  // Seed vocabularies first (if DB is available)
  await seedVocabularies();

  // Load term IDs from database (if available)
  let termIds = {};
  let dbAvailable = false;

  try {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
    await pool.query('SELECT 1'); // Test connection
    dbAvailable = true;

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
      const { rows } = await pool.query(`SELECT id, canonical_en FROM ${table}`);
      termIds[category] = {};
      for (const row of rows) {
        termIds[category][row.canonical_en.toLowerCase()] = row.id;
      }
    }
    await pool.end();
    console.log('Database connected, term IDs loaded');
  } catch (err) {
    console.warn('Database not available, proceeding with parsing only:', err.message);
  }

  // Analysis
  const report = {
    totalRows: rawData.length,
    reviewed: 0,
    draft: 0,
    skipped: 0,
    // File's own flag counts
    fileFlags: {
      missingIdentity: 0,
      duplicateBotanical: 0,
      conflictingDuplicate: 0,
    },
    // My duplicate grouping (case-folded)
    duplicateBotanical: new Map(),
    conflictingDuplicate: new Map(),
    unknownTerms: {
      karma: new Map(),
      indication: new Map(),
      rasa: new Set(),
      guna: new Set(),
      virya: new Set(),
      vipaka: new Set(),
      mala: new Set(),
      dhatu: new Set(),
      srotas: new Set(),
    },
    reviewCsv: [],
  };

  const codeSet = new Set();
  const botanicalSet = new Map();

  for (let i = 0; i < rawData.length; i++) {
    const row = rawData[i];
    const rowNum = i + 2;

    const code = row['record_id'];
    const englishName = row['English Name'];
    const sanskritName = row['Sanskrit Name'];
    const botanicalName = row['Botanical Name'];

    // Quality flags (file's own flags)
    const missingIdentity = row['quality_missing_identity'] === true || row['quality_missing_identity'] === 'true';
    const duplicateBotanical = row['quality_duplicate_botanical'] === true || row['quality_duplicate_botanical'] === 'true';
    const conflictingDuplicate = row['quality_has_conflicting_duplicate'] === true || row['quality_has_conflicting_duplicate'] === 'true';

    // Track file's own flag counts
    if (missingIdentity) report.fileFlags.missingIdentity++;
    if (duplicateBotanical) report.fileFlags.duplicateBotanical++;
    if (conflictingDuplicate) report.fileFlags.conflictingDuplicate++;

    // Status determination
    let status = 'draft';
    if (!missingIdentity && !duplicateBotanical && !conflictingDuplicate) {
      status = 'reviewed';
    }

    // Missing identity check (skip only if both English and Sanskrit are missing)
    if (!englishName && !sanskritName) {
      report.skipped++;
      continue;
    }

    // Track duplicate botanical names (case-folded)
    if (botanicalName) {
      const foldedBotanical = botanicalName.toLowerCase();
      if (duplicateBotanical) {
        if (!report.duplicateBotanical.has(foldedBotanical)) {
          report.duplicateBotanical.set(foldedBotanical, []);
        }
        report.duplicateBotanical.get(foldedBotanical).push(code);
      }
      if (conflictingDuplicate) {
        if (!report.conflictingDuplicate.has(foldedBotanical)) {
          report.conflictingDuplicate.set(foldedBotanical, []);
        }
        report.conflictingDuplicate.get(foldedBotanical).push(code);
      }
    }

    // Check for duplicate codes
    if (code && codeSet.has(code)) {
      console.warn(`Warning: Duplicate code ${code} at row ${rowNum}`);
    }
    if (code) {
      codeSet.add(code);
    }

    if (status === 'reviewed') {
      report.reviewed++;
    } else {
      report.draft++;
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
        dhatuScores.push({ term: tissue, score });
      }
    }

    // Mala Actions
    const malaActions = [];
    const malaColumns = {
      'Mala Action [Purisha]': 'Puresha',
      'Mala Action [Mutra]': 'Mutra',
      'Mala Action [Sweda]': 'Sveda',
    };
    for (const [col, mala] of Object.entries(malaColumns)) {
      const effect = parseDoshaEffect(row[col]);
      if (effect) {
        malaActions.push({ term: mala, effect });
      }
    }

    // Srotas Actions
    const srotasList = [];
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
        srotasList.push(srotas);
      }
    }

    // Match terms and collect unknown
    const matchAndCollect = (category, tokens, isClosed = false) => {
      const matched = [];
      const unmatched = [];

      for (const token of tokens) {
        const canonical = matchCanonical(category, token);
        if (canonical) {
          matched.push(canonical);
        } else {
          unmatched.push(token);
          if (isClosed) {
            report.unknownTerms[category].add(token);
          } else {
            // For open vocabularies (karma, indication), track for review CSV
            const normalized = normalizeToken(token);
            if (!report.unknownTerms[category].has(normalized)) {
              report.unknownTerms[category].set(normalized, { raw: token, count: 0 });
            }
            report.unknownTerms[category].get(normalized).count++;
          }
        }
      }

      return { matched, unmatched };
    };

    matchAndCollect('rasa', rasas, true);
    matchAndCollect('guna', gunas, true);
    matchAndCollect('karma', karmas, false);
    matchAndCollect('indication', indications, false);

    if (virya) {
      const canonical = matchCanonical('virya', virya);
      if (!canonical) {
        report.unknownTerms.virya.add(virya);
      }
    }

    if (vipaka) {
      const canonical = matchCanonical('vipaka', vipaka);
      if (!canonical) {
        report.unknownTerms.vipaka.add(vipaka);
      }
    }

    dhatuScores.forEach(d => {
      const canonical = matchCanonical('dhatu', d.term);
      if (!canonical) {
        report.unknownTerms.dhatu.add(d.term);
      }
    });

    malaActions.forEach(m => {
      const canonical = matchCanonical('mala', m.term);
      if (!canonical) {
        report.unknownTerms.mala.add(m.term);
      }
    });

    srotasList.forEach(s => {
      const canonical = matchCanonical('srotas', s);
      if (!canonical) {
        report.unknownTerms.srotas.add(s);
      }
    });
  }

  // Generate review CSV for open vocabularies
  for (const category of ['karma', 'indication']) {
    const unknownMap = report.unknownTerms[category];
    if (unknownMap instanceof Map && unknownMap.size > 0) {
      const standards = STANDARD_VOCABULARIES[category] || [];
      for (const [normalized, data] of unknownMap.entries()) {
        // Find best match using trigram similarity
        let bestMatch = '';
        let bestScore = 0;
        for (const standard of standards) {
          const score = simpleTrigramSimilarity(normalized, standard.toLowerCase());
          if (score > bestScore && score > 0.3) {
            bestScore = score;
            bestMatch = standard;
          }
        }

        report.reviewCsv.push({
          category,
          raw_token: data.raw,
          normalized_form: normalized,
          count: data.count,
          suggestion: bestMatch || '',
          approved_canonical: '',
        });
      }
    }
  }

  // Print report
  console.log('\n=== Dry Run Report ===');
  console.log(`Total rows: ${report.totalRows}`);
  console.log(`Reviewed (clean): ${report.reviewed}`);
  console.log(`Draft (flagged): ${report.draft}`);
  console.log(`Skipped (missing identity): ${report.skipped}`);

  console.log('\n=== File Flag Counts ===');
  console.log(`Missing identity (file): ${report.fileFlags.missingIdentity}`);
  console.log(`Duplicate botanical (file): ${report.fileFlags.duplicateBotanical}`);
  console.log(`Conflicting duplicate (file): ${report.fileFlags.conflictingDuplicate}`);

  console.log('\n=== Flagged Duplicates by Botanical Name ===');
  console.log(`Duplicate botanical: ${report.duplicateBotanical.size} groups`);
  for (const [botanical, codes] of report.duplicateBotanical.entries()) {
    console.log(`  ${botanical}: ${codes.join(', ')}`);
  }

  console.log(`\nConflicting duplicates: ${report.conflictingDuplicate.size} groups`);
  for (const [botanical, codes] of report.conflictingDuplicate.entries()) {
    console.log(`  ${botanical}: ${codes.join(', ')}`);
  }

  console.log('\n=== Matched vs Unmatched per Vocabulary ===');
  const closedVocabs = ['rasa', 'guna', 'virya', 'vipaka', 'mala', 'dhatu', 'srotas'];
  for (const vocab of closedVocabs) {
    const unknown = report.unknownTerms[vocab];
    if (unknown instanceof Set) {
      console.log(`${vocab}: ${unknown.size} unknown terms (quarantined)`);
      if (unknown.size > 0) {
        Array.from(unknown).slice(0, 5).forEach(t => console.log(`  - ${t}`));
        if (unknown.size > 5) {
          console.log(`  ... and ${unknown.size - 5} more`);
        }
      }
    }
  }

  console.log('\n=== Open Vocabularies (need review) ===');
  for (const vocab of ['karma', 'indication']) {
    const unknown = report.unknownTerms[vocab];
    if (unknown instanceof Map) {
      console.log(`${vocab}: ${unknown.size} unique unknown tokens`);
    }
  }

  console.log('\n=== Review CSV ===');
  console.log(`Rows: ${report.reviewCsv.length}`);
  if (report.reviewCsv.length > 0) {
    console.log('Sample rows:');
    report.reviewCsv.slice(0, 5).forEach(row => {
      console.log(`  ${row.category} | ${row.raw_token} | suggestion: ${row.suggestion || '(no match)'}`);
    });
  }

  console.log('\n=== Note ===');
  console.log('This is a DRY RUN. No data was imported.');
  console.log('Review the report above before running the real import.');
  console.log('The review CSV will be written to vocab_review.csv on real import.');
}

dryRunImport().catch((err) => {
  console.error(err);
  process.exit(1);
});
