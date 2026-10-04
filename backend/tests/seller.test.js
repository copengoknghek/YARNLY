const assert = require('node:assert/strict');
const { after, before, describe, it } = require('node:test');
const app = require('../src/app');

let server;
let baseUrl;
let sellerToken;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://localhost:${server.address().port}/api`;
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'seller@yarnly.vn', password: 'yarnly-seller' }),
  });
  sellerToken = (await loginRes.json()).data.token;
});

after(() => server.close());

const authFetch = (path, options = {}) =>
  fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sellerToken}`,
      ...options.headers,
    },
  });

describe('Seller API', () => {
  it('POST /seller/products creates pending product not visible publicly', async () => {
    const createRes = await authFetch('/seller/products', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Gấu len test',
        description: 'Sản phẩm test',
        price: 199000,
        category: 'decoration',
        stock: 10,
      }),
    });
    const created = (await createRes.json()).data;
    assert.equal(createRes.status, 201);
    assert.equal(created.approvalStatus, 'pending');

    const publicRes = await fetch(`${baseUrl}/products?search=Gấu+len+test`);
    const publicBody = await publicRes.json();
    assert.equal(publicBody.data.items.some((item) => item.id === created.id), false);
  });

  it('GET /seller/stats returns dashboard counts', async () => {
    const res = await authFetch('/seller/stats');
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.ok(body.data.pending >= 1);
  });
});
