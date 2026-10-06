const app = require('./app');
const { connectDB } = require('./config/db');
const env = require('./config/env');
const seed = require('./config/seed');
const logger = require('./utils/logger');

const start = async () => {
  await connectDB();
  await seed();
  app.listen(env.port, () => {
    logger.info(`YARNLY API running at http://localhost:${env.port}/api (${env.nodeEnv})`);
  });
};

start().catch((error) => {
  logger.error('Failed to start server', error);
  process.exit(1);
});
