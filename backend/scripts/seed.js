import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const DEFAULT_WEIGHTS = {
  rasa: 20,
  guna: 18,
  virya: 12,
  vipaka: 10,
  prabhava: 8,
  dosha: 15,
  dhatu: 6,
  mala: 3,
  srotas: 8,
  avayava: 6,
  karma: 10,
  indication: 15,
};

/** Seed synonym rows migrated from frontend simple-search mappings. */
const SEARCH_SYNONYM_SEEDS = [
  { token: 'fever', vocabulary: 'indication', slug: 'jwar' },
  { token: 'feverish', vocabulary: 'indication', slug: 'jwar' },
  { token: 'cough', vocabulary: 'karma', slug: 'kasahar' },
  { token: 'digestion', vocabulary: 'karma', slug: 'deepana' },
  { token: 'digestive', vocabulary: 'karma', slug: 'pachana' },
  { token: 'weakness', vocabulary: 'karma', slug: 'balya' },
  { token: 'skin', vocabulary: 'indication', slug: 'kushta' },
  { token: 'itching', vocabulary: 'karma', slug: 'kandughna' },
  { token: 'worms', vocabulary: 'indication', slug: 'krimirog' },
  { token: 'inflammation', vocabulary: 'karma', slug: 'shothahara' },
  { token: 'stress', vocabulary: 'karma', slug: 'medhya' },
  { token: 'energy', vocabulary: 'karma', slug: 'balya' },
];

async function seedWeights(client) {
  for (const [parameterGroup, weight] of Object.entries(DEFAULT_WEIGHTS)) {
    await client.query(
      `INSERT INTO scoring_weights (parameter_group, weight)
       VALUES ($1, $2)
       ON CONFLICT (parameter_group) DO UPDATE SET weight = EXCLUDED.weight`,
      [parameterGroup, weight]
    );
  }
}

async function seedSynonyms(client) {
  await client.query(`DELETE FROM search_synonym_seeds`);
  for (const row of SEARCH_SYNONYM_SEEDS) {
    await client.query(
      `INSERT INTO search_synonym_seeds (query_token, maps_to_vocabulary, maps_to_term_slug)
       VALUES ($1, $2, $3)`,
      [row.token, row.vocabulary, row.slug]
    );
  }
}

async function upsertUser(client, { email, password, fullName, role }) {
  const hash = await bcrypt.hash(password, 12);
  await client.query(
    `INSERT INTO users (email, password_hash, full_name, role)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) DO UPDATE SET
       password_hash = EXCLUDED.password_hash,
       full_name = EXCLUDED.full_name,
       role = EXCLUDED.role`,
    [email.toLowerCase(), hash, fullName, role]
  );
}

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await seedWeights(client);
    await seedSynonyms(client);

    const loadtestEmail = process.env.LOADTEST_EMAIL || 'loadtest@dravyaguna.local';
    const loadtestPassword = process.env.LOADTEST_PASSWORD || 'loadtest-password-change-me';

    await upsertUser(client, {
      email: loadtestEmail,
      password: loadtestPassword,
      fullName: 'Load Test Clinician',
      role: 'clinician',
    });

    await upsertUser(client, {
      email: 'admin@dravyaguna.local',
      password: process.env.SEED_ADMIN_PASSWORD || 'admin-password-change-me',
      fullName: 'Seed Admin',
      role: 'admin',
    });

    await upsertUser(client, {
      email: 'reviewer@dravyaguna.local',
      password: process.env.SEED_REVIEWER_PASSWORD || 'reviewer-password-change-me',
      fullName: 'Seed Domain Expert',
      role: 'domain_expert',
    });

    await client.query('COMMIT');
    console.log('Seed complete: scoring weights, search synonyms, dev users');
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
