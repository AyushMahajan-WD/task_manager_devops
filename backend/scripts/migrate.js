import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { getClient } from '../src/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.join(__dirname, '..', 'migrations');

async function runSQL(client, sql) {
  await client.query(sql);
}

async function up() {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql') && !f.includes('seed')).sort();
    for (const f of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, f), 'utf8');
      console.log('Applying', f);
      await runSQL(client, sql);
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    process.exit(1);
  } finally {
    client.release();
  }
}

async function seed() {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const files = fs.readdirSync(migrationsDir).filter(f => f.includes('seed') && f.endsWith('.sql')).sort();
    for (const f of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, f), 'utf8');
      console.log('Seeding', f);
      await runSQL(client, sql);
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    process.exit(1);
  } finally {
    client.release();
  }
}

async function reset() {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    await client.query('DROP TABLE IF EXISTS tasks');
    await client.query('DROP TABLE IF EXISTS projects');
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    process.exit(1);
  } finally {
    client.release();
  }
}

const cmd = process.argv[2];
if (cmd === 'up') up();
else if (cmd === 'seed') seed();
else if (cmd === 'reset') reset();
else {
  console.log('Usage: node scripts/migrate.js [up|seed|reset]');
}
