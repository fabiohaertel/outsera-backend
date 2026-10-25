const fs = require('node:fs');
const { parseMoviesCsv } = require('../csv/parseMoviesCsv');

function loadMovies(db, csvPath) {
  const movies = parseMoviesCsv(fs.readFileSync(csvPath, 'utf8'));

  const insertMovie = db.prepare('INSERT INTO movies (year, title, winner) VALUES (?, ?, ?)');
  const insertProducer = db.prepare('INSERT OR IGNORE INTO producers (name) VALUES (?)');
  const insertStudio = db.prepare('INSERT OR IGNORE INTO studios (name) VALUES (?)');
  const linkProducer = db.prepare(`
    INSERT OR IGNORE INTO movie_producers (movie_id, producer_id)
    SELECT ?, id FROM producers WHERE name = ?
  `);
  const linkStudio = db.prepare(`
    INSERT OR IGNORE INTO movie_studios (movie_id, studio_id)
    SELECT ?, id FROM studios WHERE name = ?
  `);

  db.exec('BEGIN');
  try {
    for (const movie of movies) {
      const { lastInsertRowid: movieId } = insertMovie.run(movie.year, movie.title, movie.winner ? 1 : 0);
      for (const producer of movie.producers) {
        insertProducer.run(producer);
        linkProducer.run(movieId, producer);
      }
      for (const studio of movie.studios) {
        insertStudio.run(studio);
        linkStudio.run(movieId, studio);
      }
    }
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }

  return movies.length;
}

module.exports = { loadMovies };
