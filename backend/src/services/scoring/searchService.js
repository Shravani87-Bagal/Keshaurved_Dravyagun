import { pool } from '../../db/pool.js';
import { clinicianVisibleStatuses, canSeeDraftHerbs } from '../../utils/roles.js';
import { buildSearchQuery } from './buildSearchQuery.js';
import { getScoringWeights } from './weightsCache.js';
import { resolveSearchFilters } from './resolveFilters.js';
import { mapQueryToFilterIds } from './simpleSearchMap.js';

function visibleStatusesForRole(role) {
  if (canSeeDraftHerbs(role)) {
    return ['draft', 'reviewed', 'verified'];
  }
  return clinicianVisibleStatuses();
}

export async function runDetailedSearch({ filters, role, limit, offset }) {
  const criteria = await resolveSearchFilters(filters);
  const weights = await getScoringWeights();
  const statuses = visibleStatusesForRole(role);

  const { sql, params } = buildSearchQuery(criteria, weights, {
    statuses,
    limit,
    offset,
  });

  const start = process.hrtime.bigint();
  const { rows } = await pool.query(sql, params);
  const dbDurationMs = Number(process.hrtime.bigint() - start) / 1e6;

  return {
    results: rows.map(formatSearchRow),
    meta: {
      dbDurationMs,
      unresolved: criteria.unresolved,
      activeFilterGroups: countActiveGroups(criteria),
    },
  };
}

export async function runSimpleSearch({ query, role, limit, offset }) {
  const mapped = await mapQueryToFilterIds(query);
  const filters = {
    karma: [],
    indication: [],
  };

  if (mapped.karmaIds.length) {
    const { rows } = await pool.query(
      `SELECT canonical_en FROM karma_terms WHERE id = ANY($1::int[])`,
      [mapped.karmaIds]
    );
    filters.karma = rows.map((r) => r.canonical_en);
  }

  if (mapped.indicationIds.length) {
    const { rows } = await pool.query(
      `SELECT canonical_en FROM indication_terms WHERE id = ANY($1::int[])`,
      [mapped.indicationIds]
    );
    filters.indication = rows.map((r) => r.canonical_en);
  }

  const searchResult = await runDetailedSearch({
    filters,
    role,
    limit,
    offset,
  });

  return {
    ...searchResult,
    meta: {
      ...searchResult.meta,
      query,
      mappedTokens: mapped.mappedTokens,
    },
  };
}

function formatSearchRow(row) {
  return {
    id: row.id,
    code: row.code,
    englishName: row.english_name,
    botanicalName: row.botanical_name,
    partUsed: row.part_used,
    prabhava: row.prabhava,
    status: row.status,
    imageUrl: row.image_url,
    matchPercentage: Number(row.match_percentage),
    breakdown: row.breakdown,
  };
}

function countActiveGroups(criteria) {
  let n = 0;
  if (criteria.rasaIds?.length) n += 1;
  if (criteria.gunaIds?.length) n += 1;
  if (criteria.karmaIds?.length) n += 1;
  if (criteria.indicationIds?.length) n += 1;
  if (criteria.dhatuIds?.length) n += 1;
  if (criteria.malaIds?.length) n += 1;
  if (criteria.srotasIds?.length) n += 1;
  if (criteria.avayavaIds?.length) n += 1;
  if (criteria.viryaId) n += 1;
  if (criteria.vipakaId) n += 1;
  if (criteria.doshaSelections?.length) n += 1;
  if (criteria.prabhavaTerms?.length) n += 1;
  return n;
}

export async function logSearchEvent({
  userId,
  mode,
  queryText,
  filtersJson,
  lang,
  resultCount,
  topMatchPct,
  dbDurationMs,
}) {
  await pool.query(
    `INSERT INTO search_events
      (user_id, mode, query_text, filters_json, lang, result_count, top_match_pct, db_duration_ms)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      userId ?? null,
      mode,
      queryText ?? null,
      filtersJson ? JSON.stringify(filtersJson) : null,
      lang ?? null,
      resultCount,
      topMatchPct ?? null,
      dbDurationMs ?? null,
    ]
  );
}
