import { pool } from '../../db/pool.js';
import { createCustomTerm } from '../vocabulary/vocabularyService.js';
import { logAudit } from '../audit/auditService.js';

export async function listHerbs({ page, limit, statuses }) {
  const offset = (page - 1) * limit;
  const { rows } = await pool.query(
    `SELECT id, code, english_name, sanskrit_name, botanical_name, status, created_at, updated_at
     FROM herbs
     WHERE status = ANY($1)
     ORDER BY english_name
     LIMIT $2 OFFSET $3`,
    [statuses, limit, offset]
  );

  const { rows: [{ count }] } = await pool.query(
    `SELECT COUNT(*)::int FROM herbs WHERE status = ANY($1)`,
    [statuses]
  );

  return {
    data: rows,
    pagination: {
      page,
      limit,
      total: parseInt(count),
      totalPages: Math.ceil(count / limit),
    },
  };
}

export async function getHerbById(id, userRole) {
  const { rows } = await pool.query(
    `SELECT * FROM herbs WHERE id = $1`,
    [id]
  );

  if (rows.length === 0) return null;

  const herb = rows[0];

  // Clinicians can only see reviewed/verified
  if (userRole === 'clinician' && !['reviewed', 'verified'].includes(herb.status)) {
    return null;
  }

  // Load related data
  const [rasa, guna, karma, indications, doshaActions, dhatu, mala, srotas, avayava] = await Promise.all([
    pool.query(
      `SELECT rt.canonical_en FROM herb_rasa hr JOIN rasa_terms rt ON hr.rasa_id = rt.id WHERE hr.herb_id = $1`,
      [id]
    ),
    pool.query(
      `SELECT gt.canonical_en FROM herb_guna hg JOIN guna_terms gt ON hg.guna_id = gt.id WHERE hg.herb_id = $1`,
      [id]
    ),
    pool.query(
      `SELECT kt.canonical_en FROM herb_karma hk JOIN karma_terms kt ON hk.karma_id = kt.id WHERE hk.herb_id = $1`,
      [id]
    ),
    pool.query(
      `SELECT it.canonical_en FROM herb_indications hi JOIN indication_terms it ON hi.indication_id = it.id WHERE hi.herb_id = $1`,
      [id]
    ),
    pool.query(
      `SELECT dosha, effect FROM herb_dosha_actions WHERE herb_id = $1`,
      [id]
    ),
    pool.query(
      `SELECT dt.canonical_en, score FROM herb_dhatu hd JOIN dhatu_terms dt ON hd.dhatu_id = dt.id WHERE hd.herb_id = $1`,
      [id]
    ),
    pool.query(
      `SELECT mt.canonical_en, effect FROM herb_mala hm JOIN mala_terms mt ON hm.mala_id = mt.id WHERE hm.herb_id = $1`,
      [id]
    ),
    pool.query(
      `SELECT st.canonical_en FROM herb_srotas hs JOIN srotas_terms st ON hs.srotas_id = st.id WHERE hs.herb_id = $1`,
      [id]
    ),
    pool.query(
      `SELECT at.canonical_en FROM herb_avayava ha JOIN avayava_terms at ON ha.avayava_id = at.id WHERE ha.herb_id = $1`,
      [id]
    ),
  ]);

  return {
    ...herb,
    rasa: rasa.rows.map(r => r.canonical_en),
    guna: guna.rows.map(g => g.canonical_en),
    karma: karma.rows.map(k => k.canonical_en),
    indications: indications.rows.map(i => i.canonical_en),
    dosha_actions: doshaActions.rows.reduce((acc, row) => {
      acc[row.dosha] = row.effect;
      return acc;
    }, {}),
    dhatu: dhatu.rows.reduce((acc, row) => {
      acc[row.canonical_en] = row.score;
      return acc;
    }, {}),
    mala: mala.rows.reduce((acc, row) => {
      acc[row.canonical_en] = row.effect;
      return acc;
    }, {}),
    srotas: srotas.rows.map(s => s.canonical_en),
    avayava: avayava.rows.map(a => a.canonical_en),
  };
}

export async function createHerb(data, user) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get term IDs for vocabulary fields
    const [viryaId, vipakaId] = await Promise.all([
      data.virya ? getTermId(client, 'virya_terms', data.virya) : null,
      data.vipaka ? getTermId(client, 'vipaka_terms', data.vipaka) : null,
    ]);

    // Insert herb
    const { rows: [herb] } = await client.query(
      `INSERT INTO herbs (code, english_name, sanskrit_name, botanical_name, local_name, family, part_used, prabhava, virya_id, vipaka_id, status, raw_karma, raw_indication)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'draft', $11, $12)
       RETURNING *`,
      [
        data.code,
        data.english_name,
        data.sanskrit_name || null,
        data.botanical_name || null,
        data.local_name || null,
        data.family || null,
        data.part_used || null,
        data.prabhava || null,
        viryaId,
        vipakaId,
        data.raw_karma || null,
        data.raw_indication || null,
      ]
    );

    // Insert junction table data
    await insertJunctionData(client, herb.id, data, user);

    await client.query('COMMIT');

    await logAudit({
      userId: user.id,
      action: 'create',
      entityType: 'herb',
      entityId: herb.id,
      before: null,
      after: data,
    });

    return await getHerbById(herb.id, user.role);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function updateHerb(id, data, user) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get existing herb for audit
    const { rows: [existing] } = await client.query('SELECT * FROM herbs WHERE id = $1', [id]);
    if (!existing) return null;

    // Editors cannot set verified status
    if (user.role === 'editor' && data.status === 'verified') {
      const error = new Error('Editors cannot set status to verified');
      error.code = 'FORBIDDEN';
      throw error;
    }

    // Get term IDs
    const [viryaId, vipakaId] = await Promise.all([
      data.virya !== undefined ? getTermId(client, 'virya_terms', data.virya) : existing.virya_id,
      data.vipaka !== undefined ? getTermId(client, 'vipaka_terms', data.vipaka) : existing.vipaka_id,
    ]);

    // Update herb
    const { rows: [herb] } = await client.query(
      `UPDATE herbs
       SET code = COALESCE($2, code),
           english_name = COALESCE($3, english_name),
           sanskrit_name = COALESCE($4, sanskrit_name),
           botanical_name = COALESCE($5, botanical_name),
           local_name = COALESCE($6, local_name),
           family = COALESCE($7, family),
           part_used = COALESCE($8, part_used),
           prabhava = COALESCE($9, prabhava),
           virya_id = COALESCE($10, virya_id),
           vipaka_id = COALESCE($11, vipaka_id),
           status = COALESCE($12, status),
           raw_karma = COALESCE($13, raw_karma),
           raw_indication = COALESCE($14, raw_indication),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [
        id,
        data.code,
        data.english_name,
        data.sanskrit_name,
        data.botanical_name,
        data.local_name,
        data.family,
        data.part_used,
        data.prabhava,
        viryaId,
        vipakaId,
        data.status,
        data.raw_karma,
        data.raw_indication,
      ]
    );

    // Clear and reinsert junction data if provided
    if (data.rasa !== undefined || data.guna !== undefined || data.karma !== undefined ||
        data.indications !== undefined || data.dosha_actions !== undefined || data.dhatu !== undefined ||
        data.mala !== undefined || data.srotas !== undefined || data.avayava !== undefined) {
      await clearJunctionData(client, id);
      await insertJunctionData(client, id, data, user);
    }

    await client.query('COMMIT');

    await logAudit({
      userId: user.id,
      action: 'update',
      entityType: 'herb',
      entityId: id,
      before: existing,
      after: data,
    });

    return await getHerbById(id, user.role);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function verifyHerb(id, user) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows: [existing] } = await client.query('SELECT * FROM herbs WHERE id = $1', [id]);
    if (!existing) return null;

    const { rows: [herb] } = await client.query(
      `UPDATE herbs SET status = 'verified', updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );

    await client.query('COMMIT');

    await logAudit({
      userId: user.id,
      action: 'verify',
      entityType: 'herb',
      entityId: id,
      before: existing,
      after: herb,
    });

    return await getHerbById(id, user.role);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteHerb(id, user) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows: [existing] } = await client.query('SELECT * FROM herbs WHERE id = $1', [id]);
    if (!existing) return null;

    const { rows: [herb] } = await client.query(
      `UPDATE herbs SET status = 'archived', updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );

    await client.query('COMMIT');

    await logAudit({
      userId: user.id,
      action: 'delete',
      entityType: 'herb',
      entityId: id,
      before: existing,
      after: herb,
    });

    return herb;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function getTermId(client, table, name) {
  const { rows } = await client.query(
    `SELECT id FROM ${table} WHERE canonical_en = $1`,
    [name]
  );
  if (rows.length > 0) return rows[0].id;

  // Create custom term if admin
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const { rows: [newTerm] } = await client.query(
    `INSERT INTO ${table} (canonical_en, slug, is_custom) VALUES ($1, $2, true) RETURNING id`,
    [name, slug]
  );
  return newTerm.id;
}

async function insertJunctionData(client, herbId, data, user) {
  // Rasa
  if (data.rasa?.length > 0) {
    for (const name of data.rasa) {
      const termId = await getTermId(client, 'rasa_terms', name);
      await client.query('INSERT INTO herb_rasa (herb_id, rasa_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [herbId, termId]);
    }
  }

  // Guna
  if (data.guna?.length > 0) {
    for (const name of data.guna) {
      const termId = await getTermId(client, 'guna_terms', name);
      await client.query('INSERT INTO herb_guna (herb_id, guna_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [herbId, termId]);
    }
  }

  // Karma
  if (data.karma?.length > 0) {
    for (const name of data.karma) {
      const termId = await getTermId(client, 'karma_terms', name);
      await client.query('INSERT INTO herb_karma (herb_id, karma_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [herbId, termId]);
    }
  }

  // Indications
  if (data.indications?.length > 0) {
    for (const name of data.indications) {
      const termId = await getTermId(client, 'indication_terms', name);
      await client.query('INSERT INTO herb_indications (herb_id, indication_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [herbId, termId]);
    }
  }

  // Dosha actions
  if (data.dosha_actions) {
    for (const [dosha, effect] of Object.entries(data.dosha_actions)) {
      await client.query('INSERT INTO herb_dosha_actions (herb_id, dosha, effect) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', [herbId, dosha, effect]);
    }
  }

  // Dhatu
  if (data.dhatu) {
    for (const [name, score] of Object.entries(data.dhatu)) {
      const termId = await getTermId(client, 'dhatu_terms', name);
      await client.query('INSERT INTO herb_dhatu (herb_id, dhatu_id, score) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', [herbId, termId, score]);
    }
  }

  // Mala
  if (data.mala) {
    for (const [name, effect] of Object.entries(data.mala)) {
      const termId = await getTermId(client, 'mala_terms', name);
      await client.query('INSERT INTO herb_mala (herb_id, mala_id, effect) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', [herbId, termId, effect]);
    }
  }

  // Srotas
  if (data.srotas?.length > 0) {
    for (const name of data.srotas) {
      const termId = await getTermId(client, 'srotas_terms', name);
      await client.query('INSERT INTO herb_srotas (herb_id, srotas_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [herbId, termId]);
    }
  }

  // Avayava
  if (data.avayava?.length > 0) {
    for (const name of data.avayava) {
      const termId = await getTermId(client, 'avayava_terms', name);
      await client.query('INSERT INTO herb_avayava (herb_id, avayava_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [herbId, termId]);
    }
  }
}

async function clearJunctionData(client, herbId) {
  await Promise.all([
    client.query('DELETE FROM herb_rasa WHERE herb_id = $1', [herbId]),
    client.query('DELETE FROM herb_guna WHERE herb_id = $1', [herbId]),
    client.query('DELETE FROM herb_karma WHERE herb_id = $1', [herbId]),
    client.query('DELETE FROM herb_indications WHERE herb_id = $1', [herbId]),
    client.query('DELETE FROM herb_dosha_actions WHERE herb_id = $1', [herbId]),
    client.query('DELETE FROM herb_dhatu WHERE herb_id = $1', [herbId]),
    client.query('DELETE FROM herb_mala WHERE herb_id = $1', [herbId]),
    client.query('DELETE FROM herb_srotas WHERE herb_id = $1', [herbId]),
    client.query('DELETE FROM herb_avayava WHERE herb_id = $1', [herbId]),
  ]);
}
