const path = require('node:path');

const DEFAULT_CSV_PATH = path.resolve(__dirname, '..', 'data', 'movies.csv');

module.exports = {
  csvPath: process.env.CSV_PATH ? path.resolve(process.env.CSV_PATH) : DEFAULT_CSV_PATH,
  port: Number(process.env.PORT) || 3000,
};
