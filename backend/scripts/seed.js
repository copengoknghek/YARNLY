require('dotenv').config();
const { connectDB, closeDB } = require('../src/config/db');
const seed = require('../src/config/seed');

const run = async () => {
  await connectDB();
  await seed();
  await closeDB();
};

run().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
