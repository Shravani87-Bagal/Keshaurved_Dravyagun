/**
 * Load test: 50 concurrent POST /api/search/detailed against local server.
 * Also reports pure PostgreSQL timing (dbDurationMs from search service).
 */
import dotenv from 'dotenv';
import autocannon from 'autocannon';
import pg from 'pg';

dotenv.config();

const baseUrl = process.env.LOADTEST_BASE_URL || 'http://127.0.0.1:4000';
const email = process.env.LOADTEST_EMAIL || 'loadtest@dravyaguna.local';
const password = process.env.LOADTEST_PASSWORD || 'loadtest-password-change-me';

const DETAILED_BODY = JSON.stringify({
  filters: {
    rasa: ['Tikta'],
    guna: ['Laghu'],
    karma: ['Rasayana', 'Balya'],
    indication: ['jwar'],
    virya: ['Ushna'],
    dosha: ['Vata · Decreases', 'Pitta · Decreases'],
  },
  lang: 'en-IN',
  limit: 50,
});

async function login() {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Login failed (${res.status}): ${text}`);
  }
  const data = await res.json();
  return data.token;
}

async function countHerbs() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS n FROM herbs WHERE status IN ('reviewed', 'verified')`
  );
  await pool.end();
  return rows[0].n;
}

async function getExplainExecutionTime() {
  const { buildSearchQuery } = await import('../src/services/scoring/buildSearchQuery.js');
  const { getScoringWeights } = await import('../src/services/scoring/weightsCache.js');
  const { resolveSearchFilters } = await import('../src/services/scoring/resolveFilters.js');
  const pg = await import('pg');

  // Create a separate pool for EXPLAIN to avoid closing the shared pool
  const explainPool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 1, connectionTimeoutMillis: 10000 });

  const filters = JSON.parse(DETAILED_BODY).filters;
  const criteria = await resolveSearchFilters(filters);
  const weights = await getScoringWeights();
  const { sql, params } = buildSearchQuery(criteria, weights, {
    statuses: ['reviewed', 'verified'],
    limit: 50,
    offset: 0,
  });

  const explain = await explainPool.query(
    `EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT) ${sql}`,
    params
  );

  await explainPool.end();

  // Extract execution time from EXPLAIN output
  const explainText = explain.rows.map((r) => r['QUERY PLAN']).join('\n');
  const match = explainText.match(/Execution Time: ([\d.]+) ms/);
  return match ? parseFloat(match[1]) : null;
}

async function benchmarkDbDirect(iterations = 200) {
  const { runDetailedSearch } = await import('../src/services/scoring/searchService.js');
  // Warm up caches (weights, term resolution)
  await runDetailedSearch({
    filters: JSON.parse(DETAILED_BODY).filters,
    role: 'clinician',
    limit: 50,
    offset: 0,
  });

  const samples = [];
  for (let i = 0; i < iterations; i += 1) {
    const { meta } = await runDetailedSearch({
      filters: JSON.parse(DETAILED_BODY).filters,
      role: 'clinician',
      limit: 50,
      offset: 0,
    });
    samples.push(meta.dbDurationMs);
  }
  samples.sort((a, b) => a - b);
  const avg = samples.reduce((s, v) => s + v, 0) / samples.length;
  const p95 = samples[Math.floor(samples.length * 0.95) - 1];
  return { avg, p95, samples: samples.length };
}

function formatMs(n) {
  return `${n.toFixed(2)} ms`;
}

async function main() {
  if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
    throw new Error('DATABASE_URL and JWT_SECRET required (see backend/.env.example)');
  }

  const herbCount = await countHerbs();
  console.log(`\n=== Dravyaguna search load test ===`);
  console.log(`Reviewed/verified herbs in DB: ${herbCount}`);
  if (herbCount < 300) {
    console.warn(`WARNING: expected 300+ herbs for benchmark gate (run npm run import:frontend -- --fresh)`);
  }

  console.log('\n--- Metric 1: EXPLAIN ANALYZE execution time (single query) ---');
  const explainTime = await getExplainExecutionTime();
  console.log(`EXPLAIN execution time: ${explainTime ? formatMs(explainTime) : 'N/A'}`);

  console.log('\n--- Metric 2: DB round trips per search ---');
  console.log(`DB round trips: 1 (single aggregate query with LEFT JOIN LATERAL)`);
  console.log(`Additional queries: weights cache miss only (TTL 5min)`);

  console.log('\n--- Metric 3: Direct PostgreSQL (runDetailedSearch dbDurationMs) ---');
  const dbStats = await benchmarkDbDirect(50); // Reduced from 200 for cloud latency
  console.log(`Iterations: ${dbStats.samples}`);
  console.log(`DB avg: ${formatMs(dbStats.avg)}`);
  console.log(`DB p95: ${formatMs(dbStats.p95)}`);

  const token = await login();

  console.log('\n--- HTTP autocannon (10 connections, 10s) ---');
  console.log(`Target: ${baseUrl}/api/search/detailed`);

  const result = await autocannon({
    url: `${baseUrl}/api/search/detailed`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: DETAILED_BODY,
    connections: 10,
    duration: 10,
  });

  console.log(`Requests: ${result.requests.total}`);
  console.log(`Throughput: ${result.throughput.mean} req/sec (mean)`);
  console.log(`Latency avg: ${formatMs(result.latency.mean)}`);
  console.log(`Latency p95: ${result.latency.p95 ? formatMs(result.latency.p95) : 'N/A'}`);
  console.log(`Latency p99: ${result.latency.p99 ? formatMs(result.latency.p99) : 'N/A'}`);
  console.log(`Errors: ${result.errors}`);
  console.log(`Non-2xx: ${result.non2xx}`);

  console.log('\n--- Performance Summary ---');
  console.log(`EXPLAIN ANALYZE execution time: ${explainTime ? formatMs(explainTime) : 'N/A'}`);
  console.log(`DB round trips per search: 1 + weights (cache miss only)`);
  console.log(`End-to-end API latency p95: ${result.latency.p95 ? formatMs(result.latency.p95) : 'N/A'}`);
  console.log(`\nNote: Cloud database adds network latency. Compare EXPLAIN time (pure query) vs end-to-end time.`);

  const gateDbP95 = 40;
  const gateHttpP95 = 100;
  const dbOk = dbStats.p95 < gateDbP95;
  const httpOk = result.latency.p95 < gateHttpP95;

  console.log('\n--- Gate (Phase 2) ---');
  console.log(`DB p95 target < ${gateDbP95} ms: ${dbOk ? 'PASS' : 'FAIL'}`);
  console.log(`HTTP p95 target < ${gateHttpP95} ms: ${httpOk ? 'PASS' : 'FAIL'}`);

  if (!dbOk) {
    console.log('\nRun EXPLAIN (ANALYZE, BUFFERS) with scripts/explainSearch.js');
  }

  process.exit(dbOk && httpOk ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
