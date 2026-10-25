const { DatabaseSync } = require('node:sqlite');

const SCHEMA = `
  CREATE TABLE movies (
    id INTEGER PRIMARY KEY,
    year INTEGER NOT NULL,
    title TEXT NOT NULL,
    winner INTEGER NOT NULL CHECK (winner IN (0, 1))
  );

  CREATE TABLE producers (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE studios (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE movie_producers (
    movie_id INTEGER NOT NULL REFERENCES movies(id),
    producer_id INTEGER NOT NULL REFERENCES producers(id),
    PRIMARY KEY (movie_id, producer_id)
  );

  CREATE TABLE movie_studios (
    movie_id INTEGER NOT NULL REFERENCES movies(id),
    studio_id INTEGER NOT NULL REFERENCES studios(id),
    PRIMARY KEY (movie_id, studio_id)
  );

  CREATE INDEX idx_movies_winner_year ON movies (winner, year);
`;

function createDatabase() {
  const db = new DatabaseSync(':memory:');
  db.exec(SCHEMA);
  return db;
}

module.exports = { createDatabase };
