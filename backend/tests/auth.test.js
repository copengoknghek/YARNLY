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
    assert.ok(body.message);
  });

  it('POST /auth/login works for seeded seller', async () => {
    const res = await post('/auth/login', { email: 'seller@yarnly.vn', password: 'yarnly-seller' });
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.ok(body.data.token);
    assert.equal(body.data.user.userType, 'seller');
  });

  it('POST /auth/login rejects wrong password', async () => {
    const res = await post('/auth/login', { email: 'seller@yarnly.vn', password: 'wrong-password' });
    assert.equal(res.status, 401);
  });

  it('GET /users/me requires auth', async () => {
    const res = await get('/users/me');
    assert.equal(res.status, 401);
  });

  it('GET /users/me returns profile when authenticated', async () => {
    const login = await post('/auth/login', { email: 'staff@yarnly.vn', password: 'yarnly-staff' });
    const token = (await login.json()).data.token;
    const res = await get('/users/me', token);
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.data.email, 'staff@yarnly.vn');
  });
});
