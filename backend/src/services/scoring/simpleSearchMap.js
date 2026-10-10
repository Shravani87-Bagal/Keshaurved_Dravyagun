import { pool } from '../../db/pool.js';

const SIMILARITY_THRESHOLD = 0.25;

/**
 * Maps natural-language query tokens to karma / indication term IDs (canonical English).
 * Deterministic: trigram similarity + optional seed synonyms — never LLM ranking.
 */
export async function mapQueryToFilterIds(query) {
  const normalized = String(query || '').trim().toLowerCase();
  if (!normalized) {
    return { karmaIds: [], indicationIds: [], mappedTokens: [] };
  }

  const tokens = normalized.split(/[^a-z0-9\u0900-\u097F]+/).filter(Boolean);
  const karmaIds = new Set();
  const indicationIds = new Set();
  const mappedTokens = [];

  for (const token of tokens) {
    const seedHits = await pool.query(
      `SELECT maps_to_vocabulary, maps_to_term_slug
       FROM search_synonym_seeds
       WHERE lower(query_token) = $1`,
      [token]
    );

    for (const row of seedHits.rows) {
      const table =
        row.maps_to_vocabulary === 'karma'
          ? 'karma_terms'
          : row.maps_to_vocabulary === 'indication'
            ? 'indication_terms'
            : null;
      if (!table) {
        continue;
      }
      const term = await pool.query(
        `SELECT id FROM ${table} WHERE slug = $1`,
        [row.maps_to_term_slug]
      );
      if (term.rows[0]) {
        if (table === 'karma_terms') {
          karmaIds.add(term.rows[0].id);
        } else {
          indicationIds.add(term.rows[0].id);
        }
        mappedTokens.push({ token, source: 'seed', termId: term.rows[0].id });
      }
    }

    const karmaMatch = await pool.query(
      `SELECT id, canonical_en, similarity(lower(canonical_en), $1) AS sim
       FROM karma_terms
       WHERE similarity(lower(canonical_en), $1) > $2
       ORDER BY sim DESC
       LIMIT 3`,
      [token, SIMILARITY_THRESHOLD]
    );
    for (const row of karmaMatch.rows) {
      karmaIds.add(row.id);
      mappedTokens.push({ token, source: 'trgm_karma', termId: row.id, label: row.canonical_en });
    }

    const indicationMatch = await pool.query(
      `SELECT id, canonical_en, similarity(lower(canonical_en), $1) AS sim
       FROM indication_terms
       WHERE similarity(lower(canonical_en), $1) > $2
       ORDER BY sim DESC
       LIMIT 3`,
      [token, SIMILARITY_THRESHOLD]
    );
    for (const row of indicationMatch.rows) {
      indicationIds.add(row.id);
      mappedTokens.push({
        token,
        source: 'trgm_indication',
        termId: row.id,
        label: row.canonical_en,
      });
    }
  }

  return {
    karmaIds: [...karmaIds],
    indicationIds: [...indicationIds],
    mappedTokens,
  };
}
