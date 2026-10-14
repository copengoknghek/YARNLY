const app = require('../src/app');
const { connectDB } = require('../src/config/db');

let dbReady;

app.use(async (req, res, next) => {
  if (!dbReady) {
    dbReady = connectDB();
  }
  try {
    await dbReady;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = app;
