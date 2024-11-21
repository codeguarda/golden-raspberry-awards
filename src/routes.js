import express from 'express';
import { getMovies } from './database.js';

const router = express.Router();

router.get('/intervals', (req, res) => {
  const movies = getMovies();

  const producers = {};

  // Processamento dos filmes
  movies.forEach((movie) => {
    const producer = movie.producer;
    const year = parseInt(movie.year, 10);

    if (!producers[producer]) {
      producers[producer] = [];
    }
    producers[producer].push(year);
  });

  // Calculando os intervalos de prêmios
  const intervals = {
    min: [],
    max: [],
  };

  Object.keys(producers).forEach((producer) => {
    const years = producers[producer].sort((a, b) => a - b);

    let minInterval = Infinity;
    let maxInterval = -Infinity;
    let minPair = null;
    let maxPair = null;

    for (let i = 1; i < years.length; i++) {
      const interval = years[i] - years[i - 1];

      if (interval < minInterval) {
        minInterval = interval;
        minPair = { previousWin: years[i - 1], followingWin: years[i], interval };
      }

      if (interval > maxInterval) {
        maxInterval = interval;
        maxPair = { previousWin: years[i - 1], followingWin: years[i], interval };
      }
    }

    if (minPair) {
      intervals.min.push({ producer, ...minPair });
    }
    if (maxPair) {
      intervals.max.push({ producer, ...maxPair });
    }
  });

  res.json(intervals);
});

export default router;
