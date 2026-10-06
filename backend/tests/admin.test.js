const assert = require('node:assert/strict');
const { after, before, describe, it } = require('node:test');
const { setupTestDb, teardownTestDb } = require('./setup');

let app;
let server;
let baseUrl;
let adminToken;
let sellerToken;
let pendingProductId;

before(async () => {
  await setupTestDb();
  app = require('../src/app');
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://localhost:${server.address().port}/api`;
  const adminLogin = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'staff@yarnly.vn', password: 'yarnly-staff' }),
  });
  adminToken = (await adminLogin.json()).data.token;

  const sellerLogin = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'seller@yarnly.vn', password: 'yarnly-seller' }),
  });
  sellerToken = (await sellerLogin.json()).data.token;

  const createRes = await fetch(`${baseUrl}/seller/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sellerToken}`,
    },
    body: JSON.stringify({
      name: 'Admin approve test',
      description: 'Pending product',
      price: 150000,
      category: 'fashion',
      stock: 5,
    }),
  });
  pendingProductId = (await createRes.json()).data.id;

  await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Nguyễn Minh Anh',
      email: 'buyer.admin.test@yarnly.vn',
      phone: '0912345678',
      password: 'yarnly-buyer',
    }),
  });

  const buyerLogin = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'buyer.admin.test@yarnly.vn', password: 'yarnly-buyer' }),
  });
  const buyerToken = (await buyerLogin.json()).data.token;

  await fetch(`${baseUrl}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${buyerToken}`,
    },
    body: JSON.stringify({
      items: [{ productId: 'p-001', quantity: 1 }],
      shipping: {
        email: 'buyer.admin.test@yarnly.vn',
        fullName: 'Nguyễn Minh Anh',
        phone: '0912345678',
        address: '45 Lê Duẩn',
        province: 'Đà Nẵng',
        district: 'Hải Châu',
        ward: 'Hải Châu 1',
      },
      paymentMethod: 'cod',
      carrierId: 'carrier-yarnly-express',
    }),
  });
});

after(async () => {
  if (server) server.close();
  await teardownTestDb();
});

const adminFetch = (path, options = {}) =>
  fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
      ...options.headers,
    },
  });

describe('Admin API', () => {
  it('GET /admin/products/pending lists pending products', async () => {
    const res = await adminFetch('/admin/products/pending');
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.ok(body.data.some((product) => product.id === pendingProductId));
  });

  it('POST /admin/products/:id/approve makes product public', async () => {
    const approveRes = await adminFetch(`/admin/products/${pendingProductId}/approve`, { method: 'POST' });
    assert.equal(approveRes.status, 200);

    const publicRes = await fetch(`${baseUrl}/products?search=Admin+approve+test`);
    const publicBody = await publicRes.json();
    assert.ok(publicBody.data.items.some((item) => item.id === pendingProductId));
  });

  it('GET /admin/orders returns orders', async () => {
    const res = await adminFetch('/admin/orders');
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.ok(body.data.length >= 1);
    assert.ok(body.data[0].buyerName);
    assert.ok(body.data[0].sellerName);
  });

  it('GET /admin/stats returns summary', async () => {
    const res = await adminFetch('/admin/stats');
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.ok(body.data.totalOrders >= 1);
  });
});
