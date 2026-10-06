const { randomUUID } = require('node:crypto');

class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

const notImplemented = (feature) =>
  new AppError(501, `Chức năng ${feature} chưa được triển khai`);

const generateId = () => randomUUID();

module.exports = { AppError, notImplemented, generateId };
