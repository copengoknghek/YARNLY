const env = require('./env');
const logger = require('../utils/logger');

// The database (MongoDB or PostgreSQL) has not been chosen yet; models use in-memory data until then.
const connectDB = async () => {
  if (!env.dbUri) {
    logger.warn('DB_URI is not set, using in-memory data');
    return;
  }
  logger.warn('DB_URI is set but no database driver is configured yet, using in-memory data');
};

module.exports = connectDB;
