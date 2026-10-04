const assert = require('node:assert/strict');
const { after, before, describe, it } = require('node:test');
const app = require('../src/app');

let server;
let baseUrl;
let adminToken;
let sellerToken;
let pendingProductId;

before(async () => {
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
});

after(() => server.close());

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

  it('GET /admin/orders returns seeded orders', async () => {
    const res = await adminFetch('/admin/orders');
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.ok(body.data.length >= 4);
    assert.ok(body.data[0].buyerName);
    assert.ok(body.data[0].sellerName);
  });

  it('GET /admin/stats returns summary', async () => {
    const res = await adminFetch('/admin/stats');
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.ok(body.data.totalOrders >= 4);
  });
});
