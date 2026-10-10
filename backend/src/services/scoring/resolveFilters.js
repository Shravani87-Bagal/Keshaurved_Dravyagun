import { pool } from '../../db/pool.js';
import { slugify } from '../../utils/slugify.js';

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

const TTL_MS = 300_000; // 5 minutes
const termCache = new Map();
let cacheTimestamp = 0;

async function loadTermCache() {
  const now = Date.now();
  if (now - cacheTimestamp < TTL_MS && termCache.size > 0) {
    return;
  }

  termCache.clear();
  for (const [vocab, table] of Object.entries(TERM_TABLES)) {
    const { rows } = await pool.query(
      `SELECT id, canonical_en, slug FROM ${table}`
    );
    const vocabMap = new Map();
    for (const row of rows) {
      vocabMap.set(row.slug.toLowerCase(), row.id);
      vocabMap.set(row.canonical_en.toLowerCase(), row.id);
    }
    termCache.set(vocab, vocabMap);
  }
  cacheTimestamp = now;
}

async function resolveTermIds(vocabulary, values) {
  if (!values?.length) {
    return [];
  }

  await loadTermCache();
  const vocabMap = termCache.get(vocabulary);

  return values.map((v) => {
    const slug = slugify(v);
    const id = vocabMap.get(slug.toLowerCase()) ?? vocabMap.get(String(v).toLowerCase());
    return id ?? null;
  });
}

function parseDoshaSelection(option) {
  const normalized = String(option).trim();
  const match = normalized.match(/^(\w+)\s*[·•\-]\s*(increases|decreases)$/i);
  if (!match) {
    return null;
  }

  const dosha = match[1].toLowerCase();
  const effectRaw = match[2].toLowerCase();
  const effect = effectRaw === 'increases' ? 'increases' : 'pacifies';

  if (!['vata', 'pitta', 'kapha'].includes(dosha)) {
    return null;
  }

  return { dosha, effect };
}

function parseMalaSelection(option) {
  const normalized = String(option).trim();
  const match = normalized.match(/^(\w+)\s*[·•\-]\s*(increases|decreases)$/i);
  if (!match) {
    return null;
  }

  const term = match[1].trim();
  const effectRaw = match[2].toLowerCase();
  const effect = effectRaw === 'increases' ? 'increases' : 'pacifies';

  return { term, effect };
}

/**
 * Normalizes API / frontend filter payload into ID-based criteria for SQL builder.
 */
export async function resolveSearchFilters(filters) {
  const {
    rasa = [],
    guna = [],
    karma = [],
    indication = [],
    virya = [],
    vipaka = [],
    dhatu = [],
    mala = [],
    srotas = [],
    avayava = [],
    dosha = [],
    prabhava = [],
  } = filters;

  const [
    rasaIds,
    gunaIds,
    karmaIds,
    indicationIds,
    viryaIds,
    vipakaIds,
    dhatuIds,
    malaIds,
    srotasIds,
    avayavaIds,
  ] = await Promise.all([
    resolveTermIds('rasa', rasa),
    resolveTermIds('guna', guna),
    resolveTermIds('karma', karma),
    resolveTermIds('indication', indication),
    resolveTermIds('virya', virya),
    resolveTermIds('vipaka', vipaka),
    resolveTermIds('dhatu', dhatu),
    resolveTermIds('mala', mala),
    resolveTermIds('srotas', srotas),
    resolveTermIds('avayava', avayava),
  ]);

  const doshaSelections = dosha
    .map(parseDoshaSelection)
    .filter(Boolean);

  const malaSelections = mala
    .map(parseMalaSelection)
    .filter(Boolean);

  const prabhavaTerms = (prabhava || [])
    .map((p) => String(p).trim().toLowerCase())
    .filter(Boolean);

  const unresolved = {
    rasa: rasa.filter((_, i) => rasa[i] && rasaIds[i] == null),
    guna: guna.filter((_, i) => guna[i] && gunaIds[i] == null),
    karma: karma.filter((_, i) => karma[i] && karmaIds[i] == null),
    indication: indication.filter((_, i) => indication[i] && indicationIds[i] == null),
    mala: malaSelections.filter((s, i) => mala[i] && !malaIds[i]),
  };

  // For mala, we need both term IDs and effects
  const malaIdsWithEffects = malaSelections.map((sel, i) => ({
    termId: malaIds[i],
    effect: sel.effect,
  })).filter((item) => item.termId != null);

  return {
    rasaIds: rasaIds.filter(Boolean),
    gunaIds: gunaIds.filter(Boolean),
    karmaIds: karmaIds.filter(Boolean),
    indicationIds: indicationIds.filter(Boolean),
    viryaId: viryaIds.find(Boolean) ?? null,
    vipakaId: vipakaIds.find(Boolean) ?? null,
    dhatuIds: dhatuIds.filter(Boolean),
    malaIdsWithEffects,
    srotasIds: srotasIds.filter(Boolean),
    avayavaIds: avayavaIds.filter(Boolean),
    doshaSelections,
    prabhavaTerms,
    unresolved,
  };
}
