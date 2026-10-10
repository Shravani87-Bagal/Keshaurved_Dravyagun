import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
  console.log('Checking term IDs for HERB_REC_0001 data...\n');

  const { rows: rasa } = await pool.query("SELECT id, canonical_en FROM rasa_terms WHERE canonical_en IN ('Tikta', 'Kashaya')");
  console.log('Rasa terms:');
  rasa.forEach(r => console.log(`  ${r.canonical_en}: ${r.id}`));

  const { rows: dhatu } = await pool.query("SELECT id, canonical_en FROM dhatu_terms WHERE canonical_en IN ('Rasa', 'Rakta', 'Mamsa', 'Meda', 'Asthi', 'Majja', 'Shukra')");
  console.log('\nDhatu terms:');
  dhatu.forEach(d => console.log(`  ${d.canonical_en}: ${d.id}`));

  const { rows: mala } = await pool.query("SELECT id, canonical_en FROM mala_terms WHERE canonical_en IN ('Puresha', 'Mutra')");
  console.log('\nMala terms:');
  mala.forEach(m => console.log(`  ${m.canonical_en}: ${m.id}`));

  const { rows: srotas } = await pool.query("SELECT id, canonical_en FROM srotas_terms WHERE canonical_en IN ('Rasavaha', 'Raktavaha', 'Mamsavaha', 'Medovaha', 'Majjavaha', 'Shukravaha', 'Mutravaha', 'Artavavaha')");
  console.log('\nSrotas terms:');
  srotas.forEach(s => console.log(`  ${s.canonical_en}: ${s.id}`));

  const { rows: virya } = await pool.query("SELECT id, canonical_en FROM virya_terms WHERE canonical_en = 'Ushna'");
  console.log('\nVirya terms:');
  virya.forEach(v => console.log(`  ${v.canonical_en}: ${v.id}`));

  const { rows: vipaka } = await pool.query("SELECT id, canonical_en FROM vipaka_terms WHERE canonical_en = 'Madhura'");
  console.log('\nVipaka terms:');
  vipaka.forEach(v => console.log(`  ${v.canonical_en}: ${v.id}`));

  await pool.end();
})();
