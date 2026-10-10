import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
  // Remove duplicate Kashay entry
  await pool.query("DELETE FROM rasa_terms WHERE canonical_en = 'Kashay'");
  console.log('Removed duplicate Kashay entry');

  await pool.end();
})();
