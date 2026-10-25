const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { buildApp, fixture } = require('./helpers/buildApp');

const ENDPOINT = '/producers/award-intervals';

async function getIntervals(csvPath) {
  const response = await request(buildApp(csvPath)).get(ENDPOINT);
  assert.equal(response.status, 200);
  assert.match(response.headers['content-type'], /application\/json/);
  return response.body;
}

describe(`GET ${ENDPOINT}`, () => {
  it('returns the expected intervals for the provided movies.csv', async () => {
    assert.deepEqual(await getIntervals(), {
      min: [{ producer: 'Joel Silver', interval: 1, previousWin: 1990, followingWin: 1991 }],
      max: [{ producer: 'Matthew Vaughn', interval: 13, previousWin: 2002, followingWin: 2015 }],
    });
  });

  it('returns every tied interval, including several from the same producer', async () => {
    assert.deepEqual(await getIntervals(fixture('ties.csv')), {
      min: [
        { producer: 'Producer A', interval: 1, previousWin: 2000, followingWin: 2001 },
        { producer: 'Producer B', interval: 1, previousWin: 2005, followingWin: 2006 },
      ],
      max: [
        { producer: 'Producer A', interval: 10, previousWin: 2001, followingWin: 2011 },
        { producer: 'Producer C', interval: 10, previousWin: 1990, followingWin: 2000 },
      ],
    });
  });

  it('returns empty lists when no producer has won twice', async () => {
    assert.deepEqual(await getIntervals(fixture('no-repeated-winners.csv')), { min: [], max: [] });
  });

  it('counts wins in the same year once and reports a single interval as both min and max', async () => {
    const interval = { producer: 'Producer A', interval: 3, previousWin: 2000, followingWin: 2003 };
    assert.deepEqual(await getIntervals(fixture('same-year-wins.csv')), { min: [interval], max: [interval] });
  });

  it('splits producers on ", " and " and ", and tolerates BOM, CRLF, header order and casing', async () => {
    assert.deepEqual(await getIntervals(fixture('name-formats.csv')), {
      min: [
        { producer: 'Bob', interval: 2, previousWin: 2000, followingWin: 2002 },
        { producer: 'Steve', interval: 2, previousWin: 2000, followingWin: 2002 },
      ],
      max: [{ producer: 'Joe', interval: 5, previousWin: 2000, followingWin: 2005 }],
    });
  });
});
