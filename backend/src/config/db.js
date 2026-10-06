const fs = require('node:fs');
const path = require('node:path');
const { Pool } = require('pg');
const env = require('./env');
const logger = require('../utils/logger');

const MIGRATION_LOCK_KEY = 915_062_028;

let pool;
let migrationPromise;

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

const connectDB = async () => {
  if (pool) return pool;

  if (!migrationPromise) {
    migrationPromise = (async () => {
      const bootstrap = new Pool({ connectionString: env.dbUri });
      const client = await bootstrap.connect();
      try {
        await runMigrations(client);
        logger.info('PostgreSQL connected and migrations applied');
      } finally {
        client.release();
        await bootstrap.end();
      }
    })();
  }

  await migrationPromise;

  pool = new Pool({ connectionString: env.dbUri });
  pool.on('error', (error) => {
    logger.error('Unexpected PostgreSQL pool error', error);
  });

  return pool;
};

const closeDB = async () => {
  if (!pool) return;
  await pool.end();
  pool = undefined;
  migrationPromise = undefined;
};

module.exports = { connectDB, closeDB, getPool };
