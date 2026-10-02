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

const post = (path, body) =>
  fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
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

  it('POST /auth/login reports the feature as not implemented yet', async () => {
    const res = await post('/auth/login', { email: 'a@yarnly.vn', password: 'secret1' });
    assert.equal(res.status, 501);
  });

  it('protected routes require a Bearer token', async () => {
    const res = await fetch(`${baseUrl}/users/me`);
    assert.equal(res.status, 401);
  });
});
