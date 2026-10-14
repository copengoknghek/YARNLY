const { randomInt, randomUUID } = require('node:crypto');

const ORDER_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

const notImplemented = (feature) =>
  new AppError(501, `Chức năng ${feature} chưa được triển khai`);

const generateId = () => randomUUID();

/** Order display code, e.g. YL-261011-K7Q2MX (date in Asia/Ho_Chi_Minh). */
const generateOrderCode = () => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type)?.value ?? '';
  const datePart = `${get('year')}${get('month')}${get('day')}`;
  let suffix = '';
  for (let i = 0; i < 6; i++) {
    suffix += ORDER_CODE_CHARS[randomInt(ORDER_CODE_CHARS.length)];
  }
  return `YL-${datePart}-${suffix}`;
};

module.exports = { AppError, notImplemented, generateId, generateOrderCode };
