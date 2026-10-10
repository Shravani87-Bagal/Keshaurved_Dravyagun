import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
  console.log('Resetting vocabulary tables to standard terms only...');

  // Insert standard terms (ON CONFLICT DO NOTHING to handle existing terms)
  const rasa = ['Madhura', 'Amla', 'Lavana', 'Katu', 'Tikta', 'Kashaya'];
  for (const term of rasa) {
    const slug = term.toLowerCase().replace(/\s+/g, '-');
    await pool.query('INSERT INTO rasa_terms (canonical_en, slug) VALUES ($1, $2) ON CONFLICT (canonical_en) DO NOTHING', [term, slug]);
  }

  const guna = ['Guru', 'Laghu', 'Snigdha', 'Ruksha', 'Ushna', 'Sheeta', 'Sukshma', 'Sthula', 'Sandra', 'Drava', 'Mridu', 'Kathina', 'Sara', 'Picchila', 'Manda', 'Vyavayi', 'Vishada', 'Tikshna'];
  for (const term of guna) {
    const slug = term.toLowerCase().replace(/\s+/g, '-');
    await pool.query('INSERT INTO guna_terms (canonical_en, slug) VALUES ($1, $2) ON CONFLICT (canonical_en) DO NOTHING', [term, slug]);
  }

  const karma = ['Deepana', 'Pachana', 'Rasayana', 'Balya', 'Ropana', 'Varnya', 'Jvaraghna', 'Krimighna', 'Kandughna', 'Kusthaghna', 'Pittashamak', 'Kaphashamak', 'Vatashamak', 'Vatakaphashamak', 'Pittakaphashamak', 'Vadapittashamak', 'Medhya', 'Vrishya', 'Anulomana', 'Grahi', 'Mutrala', 'Rechana', 'Vatanuloman', 'Dahashamak', 'Vishaghna', 'Tridoshhar'];
  for (const term of karma) {
    const slug = term.toLowerCase().replace(/\s+/g, '-');
    await pool.query('INSERT INTO karma_terms (canonical_en, slug) VALUES ($1, $2) ON CONFLICT (canonical_en) DO NOTHING', [term, slug]);
  }

  const srotas = ['Pranavaha', 'Annavaha', 'Udakavaha', 'Rasavaha', 'Raktavaha', 'Mamsavaha', 'Medovaha', 'Asthivaha', 'Majjavaha', 'Shukravaha', 'Mutravaha', 'Swedavaha', 'Purishavaha', 'Artavavaha'];
  for (const term of srotas) {
    const slug = term.toLowerCase().replace(/\s+/g, '-');
    await pool.query('INSERT INTO srotas_terms (canonical_en, slug) VALUES ($1, $2) ON CONFLICT (canonical_en) DO NOTHING', [term, slug]);
  }

  const virya = ['Ushna', 'Sheeta'];
  for (const term of virya) {
    const slug = term.toLowerCase().replace(/\s+/g, '-');
    await pool.query('INSERT INTO virya_terms (canonical_en, slug) VALUES ($1, $2) ON CONFLICT (canonical_en) DO NOTHING', [term, slug]);
  }

  const vipaka = ['Madhura', 'Amla', 'Katu'];
  for (const term of vipaka) {
    const slug = term.toLowerCase().replace(/\s+/g, '-');
    await pool.query('INSERT INTO vipaka_terms (canonical_en, slug) VALUES ($1, $2) ON CONFLICT (canonical_en) DO NOTHING', [term, slug]);
  }

  const mala = ['Purisha', 'Mutra', 'Sveda'];
  for (const term of mala) {
    const slug = term.toLowerCase().replace(/\s+/g, '-');
    await pool.query('INSERT INTO mala_terms (canonical_en, slug) VALUES ($1, $2) ON CONFLICT (canonical_en) DO NOTHING', [term, slug]);
  }

  const dhatu = ['Rasa', 'Rakta', 'Mamsa', 'Meda', 'Asthi', 'Majja', 'Shukra'];
  for (const term of dhatu) {
    const slug = term.toLowerCase().replace(/\s+/g, '-');
    await pool.query('INSERT INTO dhatu_terms (canonical_en, slug) VALUES ($1, $2) ON CONFLICT (canonical_en) DO NOTHING', [term, slug]);
  }

  console.log('Vocabulary seeding complete');
  await pool.end();
})();
