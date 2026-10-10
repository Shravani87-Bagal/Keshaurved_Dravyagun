import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const extraKarmas = [
  'Rechana', 'Vatanuloman', 'Dahashamak', 'Vishaghna', 'Tridoshhar'
];

(async () => {
  for (const karma of extraKarmas) {
    const slug = karma.toLowerCase().replace(/\s+/g, '-');
    await pool.query(
      'INSERT INTO karma_terms (canonical_en, slug) VALUES ($1, $2) ON CONFLICT (canonical_en) DO NOTHING',
      [karma, slug]
    );
  }
  console.log('Seeded 5 extra karma terms');
  await pool.end();
})();
