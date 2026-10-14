const fs = require('node:fs');
const path = require('node:path');
const { Pool } = require('pg');
const env = require('./env');
const logger = require('../utils/logger');

const MIGRATION_LOCK_KEY = 915_062_028;

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

const runMigrations = async (client) => {
  const migrationPath = path.join(__dirname, '../../db/migrations/001_init.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');
  await client.query('SELECT pg_advisory_lock($1)', [MIGRATION_LOCK_KEY]);
  try {
    await client.query(sql);
  } finally {
    await client.query('SELECT pg_advisory_unlock($1)', [MIGRATION_LOCK_KEY]);
  }
};

const migrate = async () => {
  if (migrationDone) return;

  const sslmode = new URLSearchParams(env.dbUri.split('?')[1] || '').get('sslmode') || 'none';
  logger.info(
    `Connecting to PostgreSQL: source=${env.dbUriSource} host=${env.dbHost || 'unparsed'} ssl=${env.dbSsl} sslmode=${sslmode}`,
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
