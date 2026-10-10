/**
 * Latency investigation:
 * 1. SELECT 1 ×50 through the same pool
 * 2. 20 sequential searches
 * 3. Load at 5, 10, 25 concurrent
 */
import dotenv from 'dotenv';
import pg from 'pg';
import autocannon from 'autocannon';

dotenv.config();

const { Pool } = pg;

async function select1Benchmark(iterations = 50) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 10 });
  const samples = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await pool.query('SELECT 1');
    const elapsed = performance.now() - start;
    samples.push(elapsed);
  }

  await pool.end();

  samples.sort((a, b) => a - b);
  const avg = samples.reduce((s, v) => s + v, 0) / samples.length;
  const p95 = samples[Math.floor(samples.length * 0.95) - 1];
  const p99 = samples[Math.floor(samples.length * 0.99) - 1];

  return { avg, p95, p99, samples: samples.length };
}

async function sequentialSearchBenchmark(iterations = 20) {
  const { runDetailedSearch } = await import('../src/services/scoring/searchService.js');

  // Warm up
  await runDetailedSearch({
    filters: {
      rasa: ['Tikta'],
      guna: ['Laghu'],
      karma: ['Rasayana', 'Balya'],
      indication: ['jwar'],
      virya: ['Ushna'],
      dosha: ['Vata · Decreases', 'Pitta · Decreases'],
    },
    role: 'clinician',
    limit: 50,
    offset: 0,
  });

  const samples = [];
  for (let i = 0; i < iterations; i++) {
    const { meta } = await runDetailedSearch({
      filters: {
        rasa: ['Tikta'],
        guna: ['Laghu'],
        karma: ['Rasayana', 'Balya'],
        indication: ['jwar'],
        virya: ['Ushna'],
        dosha: ['Vata · Decreases', 'Pitta · Decreases'],
      },
      role: 'clinician',
      limit: 50,
      offset: 0,
    });
    samples.push(meta.dbDurationMs);
  }

  samples.sort((a, b) => a - b);
  const avg = samples.reduce((s, v) => s + v, 0) / samples.length;
  const p95 = samples[Math.floor(samples.length * 0.95) - 1];
  const p99 = samples[Math.floor(samples.length * 0.99) - 1];

  return { avg, p95, p99, samples: samples.length };
}

async function concurrentLoadTest(connections, duration = 10) {
  const { loginUser } = await import('../src/services/auth/authService.js');

  const user = await loginUser({ email: 'loadtest@dravyaguna.local', password: 'loadtest-password-change-me' });
  const token = user.token;

  const body = JSON.stringify({
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

  const result = await autocannon({
    url: 'http://127.0.0.1:4000/api/search/detailed',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body,
    connections,
    duration,
  });

  return {
    requests: result.requests.total,
    throughput: result.throughput.mean,
    latencyAvg: result.latency.mean,
    latencyP95: result.latency.p95,
    latencyP99: result.latency.p99,
    errors: result.errors,
  };
}

function formatMs(n) {
  return `${n.toFixed(2)} ms`;
}

async function main() {
  console.log('=== Latency Investigation ===\n');

  console.log('1. SELECT 1 ×50 (baseline network latency)');
  const select1 = await select1Benchmark(50);
  console.log(`   Avg: ${formatMs(select1.avg)}`);
  console.log(`   P95: ${formatMs(select1.p95)}`);
  console.log(`   P99: ${formatMs(select1.p99)}`);

  console.log('\n2. 20 sequential searches (DB + app overhead)');
  const sequential = await sequentialSearchBenchmark(20);
  console.log(`   Avg: ${formatMs(sequential.avg)}`);
  console.log(`   P95: ${formatMs(sequential.p95)}`);
  console.log(`   P99: ${formatMs(sequential.p99)}`);

  console.log('\n3. Concurrent load tests');
  for (const conn of [5, 10, 25]) {
    console.log(`   ${conn} connections, 10s...`);
    const load = await concurrentLoadTest(conn, 10);
    console.log(`     Requests: ${load.requests}`);
    console.log(`     Throughput: ${load.throughput.toFixed(2)} req/sec`);
    console.log(`     Latency avg: ${formatMs(load.latencyAvg)}`);
    console.log(`     Latency p95: ${load.latencyP95 ? formatMs(load.latencyP95) : 'N/A'}`);
    console.log(`     Latency p99: ${load.latencyP99 ? formatMs(load.latencyP99) : 'N/A'}`);
    console.log(`     Errors: ${load.errors}`);
  }

  console.log('\n=== Analysis ===');
  console.log(`SELECT 1 baseline (network only): ${formatMs(select1.avg)}`);
  console.log(`Sequential search (DB + app): ${formatMs(sequential.avg)}`);
  console.log(`DB query overhead: ${formatMs(sequential.avg - select1.avg)}`);
  console.log(`Network ratio: ${((select1.avg / sequential.avg) * 100).toFixed(1)}%`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
