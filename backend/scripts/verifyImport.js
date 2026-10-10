/**
 * Verify import against Excel-derived numbers
 */
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function verifyImport() {
  console.log('=== Import Verification ===\n');

  // 1. Herb counts
  const { rows: herbCounts } = await pool.query(
    `SELECT status, COUNT(*)::int AS n FROM herbs GROUP BY status`
  );
  console.log('1. Herb counts:');
  let total = 0;
  for (const row of herbCounts) {
    console.log(`   ${row.status}: ${row.n}`);
    total += row.n;
  }
  console.log(`   Total: ${total}`);
  console.log(`   Expected: 176 (134 reviewed, 42 draft)`);
  console.log(`   Match: ${total === 176 && herbCounts.find(r => r.status === 'reviewed')?.n === 134 ? '✓' : '✗'}`);

  // 2. HERB_REC_0001 values
  console.log('\n2. HERB_REC_0001 values:');
  const { rows: herb0001 } = await pool.query(
    `SELECT id, code, english_name, status FROM herbs WHERE code = 'HERB_REC_0001'`
  );
  if (herb0001.length === 0) {
    console.log('   HERB_REC_0001 not found');
  } else {
    const herb = herb0001[0];
    console.log(`   Code: ${herb.code}`);
    console.log(`   English name: ${herb.english_name}`);
    console.log(`   Status: ${herb.status}`);

    const { rows: rasa } = await pool.query(
      `SELECT rt.canonical_en FROM herb_rasa hr JOIN rasa_terms rt ON hr.rasa_id = rt.id WHERE hr.herb_id = $1`,
      [herb.id]
    );
    console.log(`   Rasa: ${rasa.map(r => r.canonical_en).join(', ')}`);
    console.log(`   Expected: Tikta, Kashaya`);

    const { rows: dhatu } = await pool.query(
      `SELECT dt.canonical_en, hd.score FROM herb_dhatu hd JOIN dhatu_terms dt ON hd.dhatu_id = dt.id WHERE hd.herb_id = $1 ORDER BY dt.canonical_en`,
      [herb.id]
    );
    console.log(`   Dhatu: ${dhatu.map(d => `${d.canonical_en} ${d.score}`).join(', ')}`);
    console.log(`   Expected: Rasa 5, Rakta 5, Mamsa 4, Meda 4, Asthi 3, Majja 4, Shukra 3`);

    const { rows: mala } = await pool.query(
      `SELECT mt.canonical_en, hm.effect FROM herb_mala hm JOIN mala_terms mt ON hm.mala_id = mt.id WHERE hm.herb_id = $1`,
      [herb.id]
    );
    console.log(`   Mala: ${mala.map(m => `${m.canonical_en} ${m.effect}`).join(', ')}`);
    console.log(`   Expected: Puresha pacifies, Mutra increases`);

    const { rows: srotas } = await pool.query(
      `SELECT st.canonical_en FROM herb_srotas hs JOIN srotas_terms st ON hs.srotas_id = st.id WHERE hs.herb_id = $1`,
      [herb.id]
    );
    console.log(`   Srotas: ${srotas.length} (${srotas.map(s => s.canonical_en).join(', ')})`);
    console.log(`   Expected: 7`);
  }

  // 3. Tikta + Deepana (herbs with both attributes)
  console.log('\n3. Tikta + Deepana (herbs with both):');
  const { rows: tiktaDeepana } = await pool.query(
    `SELECT COUNT(*)::int AS n
     FROM herbs h
     WHERE h.status IN ('reviewed', 'verified')
     AND EXISTS (SELECT 1 FROM herb_rasa hr JOIN rasa_terms rt ON hr.rasa_id = rt.id WHERE hr.herb_id = h.id AND rt.canonical_en = 'Tikta')
     AND EXISTS (SELECT 1 FROM herb_karma hk JOIN karma_terms kt ON hk.karma_id = kt.id WHERE hk.herb_id = h.id AND kt.canonical_en = 'Deepana')`
  );
  console.log(`   Herbs with Tikta + Deepana: ${tiktaDeepana[0].n}`);
  console.log(`   Expected: 55`);
  console.log(`   Match: ${tiktaDeepana[0].n === 55 ? '✓' : '✗'}`);

  // 4. Virya Ushna
  console.log('\n4. Virya Ushna:');
  const { rows: viryaUshna } = await pool.query(
    `SELECT COUNT(*)::int AS n FROM herbs WHERE virya_id = (SELECT id FROM virya_terms WHERE canonical_en = 'Ushna') AND status IN ('reviewed', 'verified')`
  );
  console.log(`   Herbs with Virya Ushna: ${viryaUshna[0].n}`);
  console.log(`   Expected: 80`);
  console.log(`   Match: ${viryaUshna[0].n === 80 ? '✓' : '✗'}`);

  // 5. Vata pacifies (unique herbs)
  console.log('\n5. Vata pacifies (unique herbs):');
  const { rows: vataPacifies } = await pool.query(
    `SELECT COUNT(DISTINCT h.id)::int AS n
     FROM herb_dosha_actions hda
     JOIN herbs h ON hda.herb_id = h.id
     WHERE hda.dosha = 'vata' AND hda.effect = 'pacifies' AND h.status = 'reviewed'`
  );
  console.log(`   Herbs with Vata pacifies: ${vataPacifies[0].n}`);
  console.log(`   Expected: 93`);
  console.log(`   Match: ${vataPacifies[0].n === 93 ? '✓' : '✗'}`);

  await pool.end();
}

verifyImport().catch(err => {
  console.error(err);
  process.exit(1);
});
