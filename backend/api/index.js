const app = require('../src/app');
const { connectDB, migrate } = require('../src/config/db');
const seed = require('../src/config/seed');

let dbReady;

app.use(async (req, res, next) => {
  if (!dbReady) {
    dbReady = (async () => {
      await migrate();
      await connectDB();
      await seed();
    })();
  }
  try {
    await dbReady;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = app;
