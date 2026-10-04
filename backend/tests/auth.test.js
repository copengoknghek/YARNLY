const assert = require('node:assert/strict');
const { after, before, describe, it } = require('node:test');
const app = require('../src/app');

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://localhost:${server.address().port}/api`;
});

after(() => server.close());

const post = (path, body, token) =>
  fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

const get = (path, token) =>
  fetch(`${baseUrl}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

describe('Auth API', () => {
  it('POST /auth/register validates input', async () => {
    const res = await post('/auth/register', {
      name: '',
      phone: '123',
      email: 'invalid',
      password: '123',
    });
    const body = await res.json();
    assert.equal(res.status, 400);
    assert.deepEqual(
      body.errors.map((error) => error.field).sort(),
      ['email', 'name', 'password', 'phone'],
    );
  });

  it('POST /auth/login works for seeded admin', async () => {
    const res = await post('/auth/login', { email: 'staff@yarnly.vn', password: 'yarnly-staff' });
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.data.user.role, 'admin');
    assert.ok(body.data.token);
  });

  it('POST /auth/login works for seeded seller', async () => {
    const res = await post('/auth/login', { email: 'seller@yarnly.vn', password: 'yarnly-seller' });
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.data.user.userType, 'seller');
  });

  it('POST /auth/register creates buyer account', async () => {
    const res = await post('/auth/register', {
      name: 'Buyer Test',
      phone: '0909999888',
      email: 'buyer-test@yarnly.vn',
      password: 'secret12',
    });
    const body = await res.json();
    assert.equal(res.status, 201);
    assert.equal(body.data.user.userType, 'buyer');
  });

  it('protected routes require a Bearer token', async () => {
    const res = await get('/users/me');
    assert.equal(res.status, 401);
  });

  it('GET /users/me returns profile for authenticated user', async () => {
    const loginRes = await post('/auth/login', { email: 'seller@yarnly.vn', password: 'yarnly-seller' });
    const { token } = (await loginRes.json()).data;
    const res = await get('/users/me', token);
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.data.email, 'seller@yarnly.vn');
  });
});
