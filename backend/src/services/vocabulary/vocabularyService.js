import { pool } from '../../db/pool.js';

export async function createCustomTerm(category, name) {
  const tableMap = {
    rasa: 'rasa_terms',
    guna: 'guna_terms',
    karma: 'karma_terms',
    indication: 'indication_terms',
    srotas: 'srotas_terms',
    avayava: 'avayava_terms',
  };

  const table = tableMap[category];
  if (!table) {
    throw new Error(`Invalid vocabulary category: ${category}`);
  }

  const slug = name.toLowerCase().replace(/\s+/g, '-');

  const { rows } = await pool.query(
    `INSERT INTO ${table} (canonical_en, slug, is_custom) VALUES ($1, $2, true) RETURNING *`,
    [name, slug]
  );

  return rows[0];
}
