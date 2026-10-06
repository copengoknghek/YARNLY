const assert = require('node:assert/strict');
const { after, before, describe, it } = require('node:test');
const { setupTestDb, teardownTestDb } = require('./setup');

let app;
let server;
let baseUrl;

before(async () => {
  await setupTestDb();
  app = require('../src/app');
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://localhost:${server.address().port}/api`;
});

after(async () => {
  if (server) server.close();
  await teardownTestDb();
});

const SHIPPING = {
  email: 'minhanh@yarnly.vn',
  fullName: 'Nguyễn Minh Anh',
  phone: '0912345678',
  address: '45 Lê Duẩn',
  province: 'Đà Nẵng',
  district: 'Hải Châu',
  ward: 'Hải Châu 1',
};

const DEFAULT_CARRIER = 'carrier-yarnly-express';

const createOrder = (overrides = {}) =>
  fetch(`${baseUrl}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ productId: 'p-001', quantity: 2 }],
      shipping: SHIPPING,
      paymentMethod: 'cod',
      carrierId: DEFAULT_CARRIER,
      ...overrides,
    }),
  });

describe('Orders API', () => {
  it('POST /orders computes subtotal, shipping fee and total', async () => {
    const res = await createOrder();
    const { data } = await res.json();
    assert.equal(res.status, 201);
    assert.equal(data.subtotal, 298000);
    assert.equal(data.shippingFee, 12000);
    assert.equal(data.total, 310000);
    assert.equal(data.status, 'placed');
    assert.match(data.code, /^Y\d+$/);
    assert.equal(data.carrierId, DEFAULT_CARRIER);
    assert.ok(data.carrierName);
  });

  it('POST /orders validates product options', async () => {
    const valid = await createOrder({
      items: [
        { productId: 'p-003', quantity: 1, selectedOptions: { color: 'Đỏ', size: 'Size M', leadTime: '3 tuần' } },
      ],
    });
    assert.equal(valid.status, 201);

    const invalid = await createOrder({
      items: [{ productId: 'p-003', quantity: 1, selectedOptions: { color: 'Tím' } }],
    });
    assert.equal(invalid.status, 400);
  });

  it('POST /orders prices a custom design on the server', async () => {
    const res = await createOrder({
      items: [
        {
          productId: 'custom-design',
          quantity: 1,
          customDesign: { baseProduct: 'doll', style: 'chibi', accessory: 'bow', mainColor: '#f48aa0' },
        },
      ],
    });
    const { data } = await res.json();
    assert.equal(res.status, 201);
    assert.equal(data.subtotal, 461000);
  });

  it('POST /orders rejects quantity above stock and unknown payment methods', async () => {
    const outOfStock = await createOrder({ items: [{ productId: 'p-006', quantity: 1 }] });
    assert.equal(outOfStock.status, 400);

    const badPayment = await createOrder({ paymentMethod: 'bitcoin' });
    assert.equal(badPayment.status, 400);
  });

  it('POST /orders rejects missing carrier', async () => {
    const res = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'p-001', quantity: 1 }],
        shipping: SHIPPING,
        paymentMethod: 'cod',
      }),
    });
    assert.equal(res.status, 400);
  });

  it('GET /orders/lookup finds orders by phone or email', async () => {
    await createOrder();
    const byPhone = await fetch(`${baseUrl}/orders/lookup?phone=%2B84912345678`);
    assert.equal(byPhone.status, 200);
    assert.ok((await byPhone.json()).data.length > 0);

    const byEmail = await fetch(`${baseUrl}/orders/lookup?email=MINHANH@yarnly.vn`);
    assert.ok((await byEmail.json()).data.length > 0);

    const missing = await fetch(`${baseUrl}/orders/lookup`);
    assert.equal(missing.status, 400);
  });
});

describe('Shipping API', () => {
  it('GET /shipping/quotes returns carrier options by province', async () => {
    const local = await fetch(`${baseUrl}/shipping/quotes?province=${encodeURIComponent('Đà Nẵng')}`);
    const localBody = await local.json();
    assert.equal(local.status, 200);
    assert.equal(localBody.data.zone, 'local');
    assert.equal(localBody.data.quotes.length, 3);
    assert.equal(localBody.data.quotes[0].fee, 12000);

    const national = await fetch(`${baseUrl}/shipping/quotes?province=${encodeURIComponent('TP. Hồ Chí Minh')}`);
    const nationalBody = await national.json();
    assert.equal(national.status, 200);
    assert.equal(nationalBody.data.zone, 'national');
    assert.ok(nationalBody.data.quotes.some((quote) => quote.carrierId === 'carrier-ghn'));
  });
});
