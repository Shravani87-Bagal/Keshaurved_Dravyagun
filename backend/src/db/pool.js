import pg from 'pg';
import { env } from '../config/env.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.databaseUrl,
  max: 20, // Reduce for cloud connection limits
  idleTimeoutMillis: 10000, // Keep connections alive longer
  connectionTimeoutMillis: 10000, // Increase for cloud latency
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error', err);
});
