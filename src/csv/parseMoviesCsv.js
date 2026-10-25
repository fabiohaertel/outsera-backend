const { splitNames } = require('./splitNames');

const DELIMITER = ';';
const REQUIRED_COLUMNS = ['year', 'title', 'studios', 'producers', 'winner'];

function parseMoviesCsv(content) {
  const lines = content.replace(/^﻿/, '').split(/\r?\n/);
  const headerIndex = lines.findIndex((line) => line.trim() !== '');
  if (headerIndex === -1) {
    throw new Error('CSV is empty');
  }

  const header = lines[headerIndex].split(DELIMITER).map((column) => column.trim().toLowerCase());
  const columnIndex = Object.fromEntries(REQUIRED_COLUMNS.map((column) => [column, header.indexOf(column)]));
  const missing = REQUIRED_COLUMNS.filter((column) => columnIndex[column] === -1);
  if (missing.length > 0) {
    throw new Error(`CSV header is missing columns: ${missing.join(', ')}`);
  }

  const movies = [];
  for (let i = headerIndex + 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;

    const fields = lines[i].split(DELIMITER);
    const field = (column) => (fields[columnIndex[column]] ?? '').trim();

    const year = Number(field('year'));
    if (field('year') === '' || !Number.isInteger(year)) {
      throw new Error(`Invalid year "${field('year')}" at line ${i + 1}`);
    }

    movies.push({
      year,
      title: field('title'),
      studios: splitNames(field('studios')),
      producers: splitNames(field('producers')),
      winner: field('winner').toLowerCase() === 'yes',
    });
  }

  return movies;
}

module.exports = { parseMoviesCsv };
