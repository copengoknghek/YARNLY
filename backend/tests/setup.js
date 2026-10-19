require('dotenv').config({ quiet: true });

const DEFAULT_TEST_URI = 'postgresql://yarnly:yarnly@localhost:5432/yarnly_test';

// Must be set before src/config/env is loaded so tests never send real email
// and never truncate the development database.
process.env.NODE_ENV = 'test';
process.env.DB_URI = process.env.TEST_DB_URI || DEFAULT_TEST_URI;

const { Pool } = require('pg');
const { closeDB, connectDB, migrate } = require('../src/config/db');
const seed = require('../src/config/seed');

const ensureTestDatabase = async (testUri) => {
  const pool = new Pool({ connectionString: testUri });
  try {
    await pool.query('SELECT 1');
    await pool.end();
    return;
  } catch (error) {
    await pool.end().catch(() => {});
    if (error.code !== '3D000') throw error;
  }

  const adminUri = testUri.replace(/\/[^/]+$/, '/yarnly');
  const admin = new Pool({ connectionString: adminUri });
  await admin.query('CREATE DATABASE yarnly_test');
  await admin.end();
};

const setupTestDb = async () => {
  await ensureTestDatabase(process.env.DB_URI);
  await migrate();
  await connectDB();
  await seed({ force: true });
};

const teardownTestDb = async () => {
  await closeDB();
};

module.exports = { setupTestDb, teardownTestDb };
