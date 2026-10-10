import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
  console.log('Clearing all herb data...');
  await pool.query('DELETE FROM herb_srotas');
  await pool.query('DELETE FROM herb_mala');
  await pool.query('DELETE FROM herb_dhatu');
  await pool.query('DELETE FROM herb_dosha_actions');
  await pool.query('DELETE FROM herb_avayava');
  await pool.query('DELETE FROM herb_indications');
  await pool.query('DELETE FROM herb_karma');
  await pool.query('DELETE FROM herb_guna');
  await pool.query('DELETE FROM herb_rasa');
  await pool.query('DELETE FROM herb_regional_names');
  await pool.query('DELETE FROM herb_references');
  await pool.query('DELETE FROM herbs');
  console.log('All herb data cleared');
  await pool.end();
})();
