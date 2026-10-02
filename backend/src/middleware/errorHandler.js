const env = require('../config/env');
const logger = require('../utils/logger');
const { AppError } = require('../utils/helpers');

const notFound = (req, res, next) => {
  next(new AppError(404, `Không tìm thấy ${req.method} ${req.originalUrl}`));
};

// Express identifies error handlers by their 4-argument signature, so `next` must stay.
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode ?? 500;
  const isServerError = statusCode >= 500 && statusCode !== 501;

  if (isServerError) {
    logger.error(err.message, err);
  }

  res.status(statusCode).json({
    message: isServerError && env.nodeEnv === 'production' ? 'Lỗi máy chủ' : err.message,
  });
};

module.exports = { notFound, errorHandler };
