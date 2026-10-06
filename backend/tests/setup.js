// Must be set before src/config/env is loaded so tests never send real email.
process.env.NODE_ENV = 'test';

const { Pool } = require('pg');
const { closeDB, connectDB } = require('../src/config/db');
const seed = require('../src/config/seed');

const DEFAULT_TEST_URI = 'postgresql://yarnly:yarnly@localhost:5432/yarnly_test';

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
  const testUri = process.env.TEST_DB_URI || DEFAULT_TEST_URI;
  await ensureTestDatabase(testUri);
  process.env.DB_URI = testUri;
  await connectDB();
  await seed({ force: true });
};

const teardownTestDb = async () => {
  await closeDB();
};

module.exports = { setupTestDb, teardownTestDb };
