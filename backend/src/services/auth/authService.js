import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../../db/pool.js';
import { env } from '../../config/env.js';
import { ROLES } from '../../utils/roles.js';

const SALT_ROUNDS = 12;

export async function registerUser({ email, password, fullName }) {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const { rows } = await pool.query(
    `INSERT INTO users (email, password_hash, full_name, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, full_name, role, status, created_at`,
    [email.toLowerCase(), passwordHash, fullName, ROLES.CLINICIAN]
  );
  return rows[0];
}

export async function loginUser({ email, password }) {
  const { rows } = await pool.query(
    `SELECT id, email, password_hash, full_name, role, status
     FROM users WHERE email = $1`,
    [email.toLowerCase()]
  );
  const user = rows[0];
  if (!user || user.status !== 'active') {
    return null;
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    return null;
  }

  const token = jwt.sign(
    { email: user.email, role: user.role },
    env.jwtSecret,
    { subject: user.id, expiresIn: env.jwtExpiresIn }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
    },
  };
}
