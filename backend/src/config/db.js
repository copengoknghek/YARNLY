const fs = require('node:fs');
const path = require('node:path');
const { Pool } = require('pg');
const env = require('./env');
const logger = require('../utils/logger');

const MIGRATION_LOCK_KEY = 915_062_028;
const MIGRATIONS_DIR = path.join(__dirname, '../../db/migrations');

let pool;
let migrationDone;

const buildPoolConfig = () => {
  const config = {
    connectionString: env.dbUri,
    max: env.isServerless ? 3 : 10,
    idleTimeoutMillis: env.isServerless ? 5_000 : 30_000,
  };
  if (env.dbSsl) {
    config.ssl = { rejectUnauthorized: false };
  }
  return config;
};

const getPool = () => {
  if (!pool) {
    throw new Error('Database is not connected. Call connectDB() first.');
  }
  return pool;
};

const listMigrationFiles = () =>
  fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((name) => name.endsWith('.sql'))
    .sort();

const ensureMigrationTable = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
};

const bootstrapExistingDatabase = async (client, applied) => {
  if (applied.size > 0) return;

  const { rows } = await client.query(
    `SELECT 1
     FROM information_schema.tables
     WHERE table_schema = 'public' AND table_name = 'users'
     LIMIT 1`,
  );
  if (rows.length === 0) return;

  const initName = '001_init.sql';
  await client.query('INSERT INTO schema_migrations (name) VALUES ($1) ON CONFLICT DO NOTHING', [
    initName,
  ]);
  applied.add(initName);
  logger.info('Marked 001_init.sql as applied (existing database)');
};

const runMigrations = async (client) => {
  await client.query('SELECT pg_advisory_lock($1)', [MIGRATION_LOCK_KEY]);
  try {
    await ensureMigrationTable(client);

    const { rows: appliedRows } = await client.query('SELECT name FROM schema_migrations');
    const applied = new Set(appliedRows.map((row) => row.name));

    await bootstrapExistingDatabase(client, applied);

    for (const file of listMigrationFiles()) {
      if (applied.has(file)) continue;

      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
      logger.info(`Applying migration ${file}`);
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
    }
  } finally {
    await client.query('SELECT pg_advisory_unlock($1)', [MIGRATION_LOCK_KEY]);
  }
};

const migrate = async () => {
  if (migrationDone) return;

  let envPath;
  try {
    envPath = require.resolve('./env');
  } catch (error) {
    envPath = `unresolved (${error.code})`;
  }
  logger.info(
    `Connecting to PostgreSQL: envPath=${envPath} envType=${typeof env} envKeys=${Object.keys(env || {}).join(',')} source=${env.dbUriSource} host=${env.dbHost} ssl=${env.dbSsl}`,
  );

  const bootstrap = new Pool(buildPoolConfig());
  const client = await bootstrap.connect();
  try {
    await runMigrations(client);
    migrationDone = true;
    logger.info('PostgreSQL migrations applied');
  } finally {
    client.release();
    await bootstrap.end();
  }
};

const connectDB = async () => {
  if (pool) return pool;

  pool = new Pool(buildPoolConfig());
  pool.on('error', (error) => {
    logger.error('Unexpected PostgreSQL pool error', error);
  });

  return pool;
};

const closeDB = async () => {
  if (!pool) return;
  await pool.end();
  pool = undefined;
};

module.exports = { connectDB, closeDB, getPool, migrate };
