import { pool } from '../../db/pool.js';

export async function logAudit({ userId, action, entityType, entityId, before, after }) {
  await pool.query(
    `INSERT INTO audit_log (actor_id, action, entity_type, entity_id, before_json, after_json)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [userId, action, entityType, entityId, JSON.stringify(before || {}), JSON.stringify(after || {})]
  );
}
