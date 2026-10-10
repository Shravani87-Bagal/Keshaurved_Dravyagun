import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
  const { rows: rasa } = await pool.query('SELECT id, canonical_en, slug FROM rasa_terms');
  console.log('Rasa terms:');
  rasa.forEach(r => console.log(`  ${r.canonical_en} (${r.slug})`));

  const { rows: virya } = await pool.query('SELECT id, canonical_en, slug FROM virya_terms');
  console.log('\nVirya terms:');
  virya.forEach(r => console.log(`  ${r.canonical_en} (${r.slug})`));

  const { rows: vipaka } = await pool.query('SELECT id, canonical_en, slug FROM vipaka_terms');
  console.log('\nVipaka terms:');
  vipaka.forEach(r => console.log(`  ${r.canonical_en} (${r.slug})`));

  await pool.end();
})();
