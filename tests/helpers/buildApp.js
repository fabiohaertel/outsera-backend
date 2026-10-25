const path = require('node:path');
const { createDatabase } = require('../../src/database/connection');
const { loadMovies } = require('../../src/loaders/loadMovies');
const { createApp } = require('../../src/app');

const DEFAULT_CSV = path.resolve(__dirname, '..', '..', 'data', 'movies.csv');

function fixture(name) {
  return path.resolve(__dirname, '..', 'fixtures', name);
}

function buildApp(csvPath = DEFAULT_CSV) {
  const db = createDatabase();
  loadMovies(db, csvPath);
  return createApp(db);
}

module.exports = { buildApp, fixture };
