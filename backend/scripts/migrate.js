require('dotenv').config();
const { migrate, closeDB } = require('../src/config/db');

migrate()
  .then(() => closeDB())
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
