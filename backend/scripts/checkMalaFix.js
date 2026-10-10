import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
  const { rows: herb } = await pool.query('SELECT id FROM herbs WHERE code = $1', ['HERB_REC_0001']);
  const { rows: mala } = await pool.query(
    'SELECT mt.canonical_en, hm.effect FROM herb_mala hm JOIN mala_terms mt ON hm.mala_id = mt.id WHERE hm.herb_id = $1',
    [herb[0].id]
  );
  console.log('Mala:');
  mala.forEach(m => console.log(`  ${m.canonical_en}: ${m.effect}`));
  await pool.end();
})();
