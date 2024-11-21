const { getDatabase } = require('../database');

const getProducersWithIntervals = (req, res) => {
  const db = getDatabase();

  const query = `
    SELECT 
      p.name AS producer,
      m1.year AS previousWin,
      m2.year AS followingWin,
      (m2.year - m1.year) AS interval
    FROM 
      producers p
    JOIN movie_producers mp1 ON p.id = mp1.producer_id
    JOIN movie_producers mp2 ON p.id = mp2.producer_id
    JOIN movies m1 ON mp1.movie_id = m1.id AND m1.winner = 1
    JOIN movies m2 ON mp2.movie_id = m2.id AND m2.winner = 1
    WHERE m2.year > m1.year
    ORDER BY p.name, m1.year;
  `;

  db.all(query, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar dados' });
    }

    const intervals = rows.reduce((acc, row) => {
      const { producer, interval } = row;
      if (!acc[producer]) acc[producer] = [];
      acc[producer].push(interval);
      return acc;
    }, {});

    const result = {
      min: [],
      max: [],
    };

    Object.keys(intervals).forEach((producer) => {
      const producerIntervals = intervals[producer];
      const minInterval = Math.min(...producerIntervals);
      const maxInterval = Math.max(...producerIntervals);

      result.min.push({ producer, interval: minInterval });
      result.max.push({ producer, interval: maxInterval });
    });

    res.json(result);
  });
};

module.exports = { getProducersWithIntervals };
