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

const getJson = async (path) => {
  const res = await fetch(`${baseUrl}${path}`);
  return { res, body: await res.json() };
};

describe('Products API', () => {
  it('GET /health returns ok', async () => {
    const { res, body } = await getJson('/health');
    assert.equal(res.status, 200);
    assert.equal(body.data.status, 'ok');
  });

  it('GET /products returns a paginated list', async () => {
    const { res, body } = await getJson('/products?page=1&pageSize=4');
    assert.equal(res.status, 200);
    assert.equal(body.data.items.length, 4);
    assert.equal(body.data.page, 1);
    assert.equal(body.data.pageSize, 4);
    assert.equal(body.data.totalPages, Math.ceil(body.data.total / 4));
  });

  it('GET /products includes seller info', async () => {
    const { body } = await getJson('/products?pageSize=1');
    assert.ok(body.data.items[0].sellerId);
    assert.ok(body.data.items[0].sellerName);
  });

  it('GET /products filters by category', async () => {
    const { res, body } = await getJson('/products?category=decoration');
    assert.equal(res.status, 200);
    assert.ok(body.data.items.length > 0);
    assert.ok(body.data.items.every((product) => product.category === 'decoration'));
  });

  it('GET /products sorts by price ascending', async () => {
    const { body } = await getJson('/products?sort=price-asc');
    const prices = body.data.items.map((product) => product.price);
    assert.deepEqual(prices, [...prices].sort((a, b) => a - b));
  });

  it('GET /products filters best sellers and stock status', async () => {
    const bestSellers = await getJson('/products?bestSeller=true');
    assert.ok(bestSellers.body.data.items.every((product) => product.isBestSeller));

    const outOfStock = await getJson('/products?status=out-of-stock');
    assert.ok(outOfStock.body.data.items.every((product) => product.stock === 0));
  });

  it('GET /products rejects an unknown category or sort', async () => {
    assert.equal((await fetch(`${baseUrl}/products?category=unknown`)).status, 400);
    assert.equal((await fetch(`${baseUrl}/products?sort=random`)).status, 400);
  });

  it('GET /products/:id returns 404 for a missing product', async () => {
    const res = await fetch(`${baseUrl}/products/does-not-exist`);
    assert.equal(res.status, 404);
  });

  it('GET /custom-designs/options returns the pricing table', async () => {
    const { res, body } = await getJson('/custom-designs/options');
    assert.equal(res.status, 200);
    assert.ok(body.data.baseProducts.length > 0);
    assert.ok(body.data.styles.length > 0);
  });
});
