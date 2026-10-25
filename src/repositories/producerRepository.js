// Consecutive wins per producer (same-year wins collapse into one), keeping only
// the intervals equal to the global minimum or maximum.
const AWARD_INTERVALS_SQL = `
  WITH wins AS (
    SELECT DISTINCT p.name AS producer, m.year
    FROM movies m
    JOIN movie_producers mp ON mp.movie_id = m.id
    JOIN producers p ON p.id = mp.producer_id
    WHERE m.winner = 1
  ),
  consecutive AS (
    SELECT producer,
           LAG(year) OVER (PARTITION BY producer ORDER BY year) AS previousWin,
           year AS followingWin
    FROM wins
  ),
  intervals AS (
    SELECT producer, followingWin - previousWin AS interval, previousWin, followingWin
    FROM consecutive
    WHERE previousWin IS NOT NULL
  ),
  bounds AS (
    SELECT MIN(interval) AS minInterval, MAX(interval) AS maxInterval FROM intervals
  )
  SELECT i.producer, i.interval, i.previousWin, i.followingWin,
         i.interval = b.minInterval AS isMin,
         i.interval = b.maxInterval AS isMax
  FROM intervals i, bounds b
  WHERE i.interval IN (b.minInterval, b.maxInterval)
  ORDER BY i.producer, i.previousWin
`;

function createProducerRepository(db) {
  const awardIntervalsStatement = db.prepare(AWARD_INTERVALS_SQL);

  return {
    findAwardIntervals() {
      const result = { min: [], max: [] };
      for (const { isMin, isMax, ...interval } of awardIntervalsStatement.all()) {
        if (isMin) result.min.push(interval);
        if (isMax) result.max.push(interval);
      }
      return result;
    },
  };
}

module.exports = { createProducerRepository };
