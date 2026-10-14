const { connectDB, migrate } = require('../config/db');
const seed = require('../config/seed');

let dbReady;

const ensureDatabase = async (req, res, next) => {
  if (!dbReady) {
    dbReady = (async () => {
      await migrate();
      await connectDB();
      await seed();
    })().catch((error) => {
      dbReady = undefined;
      throw error;
    });
  }
  try {
    await dbReady;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { ensureDatabase };
