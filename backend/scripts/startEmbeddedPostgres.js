import EmbeddedPostgres from 'embedded-postgres';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../.embedded-pg');
const port = Number(process.env.EMBEDDED_PG_PORT || 54329);

async function main() {
  fs.mkdirSync(dataDir, { recursive: true });

  const pg = new EmbeddedPostgres({
    databaseDir: dataDir,
    user: 'postgres',
    password: 'postgres',
    port,
    persistent: true,
    initdbFlags: ['--encoding=UTF8', '--locale=C'],
  });

  await pg.initialise();
  await pg.start();

  const dbName = 'dravyaguna';
  try {
    await pg.createDatabase(dbName);
  } catch {
    // already exists
  }

  const url = `postgresql://postgres:postgres@127.0.0.1:${port}/${dbName}`;
  console.log(url);
  console.error(`Embedded PostgreSQL listening on 127.0.0.1:${port} (pid ${process.pid})`);
  console.error('Press Ctrl+C to stop.');

  process.on('SIGINT', async () => {
    await pg.stop();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
