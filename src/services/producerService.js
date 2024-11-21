const db = require('../database');

const getProducersWithAwards = async () => {
  const query = `
    SELECT producer, year AS awardYear
    FROM movies
    WHERE winner = 'yes'
  `;
  
  const rows = await db.all(query);

  // Agrupar prêmios por produtor
  const producerAwards = {};
  rows.forEach(({ producer, awardYear }) => {
    producer.split(',').map((p) => p.trim()).forEach((p) => {
      if (!producerAwards[p]) producerAwards[p] = [];
      producerAwards[p].push(awardYear);
    });
  });

  // Calcular intervalos
  const intervals = [];
  Object.entries(producerAwards).forEach(([producer, years]) => {
    if (years.length > 1) {
      years.sort((a, b) => a - b);
      for (let i = 1; i < years.length; i++) {
        intervals.push({
          producer,
          interval: years[i] - years[i - 1],
          previousWin: years[i - 1],
          followingWin: years[i],
        });
      }
    }
  });

  // Encontrar min e max
  const minInterval = Math.min(...intervals.map((i) => i.interval));
  const maxInterval = Math.max(...intervals.map((i) => i.interval));

  const min = intervals.filter((i) => i.interval === minInterval);
  const max = intervals.filter((i) => i.interval === maxInterval);

  return { min, max };
};

module.exports = {
  getProducersWithAwards,
};
