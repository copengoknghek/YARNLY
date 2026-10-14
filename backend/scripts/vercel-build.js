require('dotenv').config();
const { connectDB, closeDB, migrate } = require('../src/config/db');
const seed = require('../src/config/seed');

const hasDatabaseUrl = Boolean(process.env.DB_URI || process.env.DATABASE_URL);

const run = async () => {
  if (!hasDatabaseUrl) {
    console.log(
      'Skipping migrate/seed: no DB_URI or DATABASE_URL at build time. Migrations run on first API request.',
    );
    return;
  }

  await migrate();
  await connectDB();
  await seed();
  await closeDB();
};

run().catch((error) => {
  console.error('vercel-build failed:', error);
  process.exit(1);
});
