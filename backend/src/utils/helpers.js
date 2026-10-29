const { randomInt, randomUUID } = require('node:crypto');

const ORDER_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const DEFAULT_ORDER_CODE_PREFIX = 'YL';
const ORDER_CODE_PREFIXES = {
  'carrier-yarnly-express': 'YL',
  'carrier-ghn': 'GHN',
  'carrier-viettel': 'VP',
};

class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

const notImplemented = (feature) =>
  new AppError(501, `Chức năng ${feature} chưa được triển khai`);

const generateId = () => randomUUID();

/** Order display code, e.g. YL-261011-K7Q2MX / GHN-261011-K7Q2MX / VP-261011-K7Q2MX. */
const generateOrderCode = (carrierId) => {
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
  const prefix = ORDER_CODE_PREFIXES[carrierId] ?? DEFAULT_ORDER_CODE_PREFIX;
  return `${prefix}-${datePart}-${suffix}`;
};

module.exports = { AppError, notImplemented, generateId, generateOrderCode };
