const config = require('./config');
const { createDatabase } = require('./database/connection');
const { loadMovies } = require('./loaders/loadMovies');
const { createApp } = require('./app');

function main() {
  const db = createDatabase();

  try {
    const count = loadMovies(db, config.csvPath);
    console.log(`Loaded ${count} movies from ${config.csvPath}`);
  } catch (error) {
    console.error(`Failed to load movies from ${config.csvPath}: ${error.message}`);
    process.exit(1);
  }

  createApp(db).listen(config.port, () => {
    console.log(`Server listening on http://localhost:${config.port}`);
  });
}

main();
