const assert = require('node:assert/strict');
const { describe, it } = require('node:test');
const { generateOrderCode } = require('../src/utils/helpers');

const SUFFIX = '[A-HJ-NP-Z2-9]{6}';

describe('generateOrderCode', () => {
  it('uses YL prefix for Yarnly Express', () => {
    assert.match(generateOrderCode('carrier-yarnly-express'), new RegExp(`^YL-\\d{6}-${SUFFIX}$`));
  });

  it('uses GHN prefix for GHN', () => {
    assert.match(generateOrderCode('carrier-ghn'), new RegExp(`^GHN-\\d{6}-${SUFFIX}$`));
  });

  it('uses VP prefix for Viettel Post', () => {
    assert.match(generateOrderCode('carrier-viettel'), new RegExp(`^VP-\\d{6}-${SUFFIX}$`));
  });

  it('falls back to YL when carrier is unknown', () => {
    assert.match(generateOrderCode('carrier-unknown'), new RegExp(`^YL-\\d{6}-${SUFFIX}$`));
  });
});
