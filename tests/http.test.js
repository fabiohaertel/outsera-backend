const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const request = require('supertest');
const { buildApp, fixture } = require('./helpers/buildApp');

describe('HTTP semantics', () => {
  const app = buildApp();

  it('responds 404 with a JSON body for unknown resources', async () => {
    const response = await request(app).get('/unknown');
    assert.equal(response.status, 404);
    assert.deepEqual(response.body, { error: 'Resource not found' });
  });

  for (const method of ['post', 'put', 'patch', 'delete']) {
    it(`responds 405 to ${method.toUpperCase()} on /producers/award-intervals`, async () => {
      const response = await request(app)[method]('/producers/award-intervals');
      assert.equal(response.status, 405);
      assert.equal(response.headers.allow, 'GET, HEAD');
    });
  }
});

describe('startup', () => {
  const server = path.resolve(__dirname, '..', 'src', 'server.js');

  for (const csv of ['invalid-header.csv', 'does-not-exist.csv']) {
    it(`exits with code 1 when the CSV cannot be loaded (${csv})`, () => {
      const result = spawnSync(process.execPath, [server], {
        env: { ...process.env, CSV_PATH: fixture(csv), PORT: '0' },
        encoding: 'utf8',
        timeout: 10000,
      });
      assert.equal(result.status, 1);
      assert.match(result.stderr, /Failed to load movies/);
    });
  }
});
