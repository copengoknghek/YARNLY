const format = (level, message) =>
  `[${new Date().toISOString()}] ${level.toUpperCase()} ${message}`;

const logger = {
  info: (message) => console.log(format('info', message)),
  warn: (message) => console.warn(format('warn', message)),
  error: (message, error) => console.error(format('error', message), error ?? ''),
};

module.exports = logger;
