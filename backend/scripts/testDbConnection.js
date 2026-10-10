import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

pool.query('SELECT 1 as test')
  .then(result => {
    console.log('DB OK:', result.rows[0]);
    pool.end();
  })
  .catch(err => {
    console.error('DB Error:', err.message);
    console.error('Full error:', err);
    pool.end();
  });
