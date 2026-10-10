import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
  const { rows } = await pool.query("SELECT email, role FROM users WHERE email LIKE '%@test.com'");
  console.log('Test users:');
  rows.forEach(r => console.log(`  ${r.email}: ${r.role}`));
  await pool.end();
})();
