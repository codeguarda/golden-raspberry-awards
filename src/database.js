const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

let db;

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(':memory:', (err) => {
      if (err) {
        return reject(err);
      }
      console.log('Banco de dados em memória criado.');

      // Criação das tabelas
      db.serialize(() => {
        db.run(`
          CREATE TABLE movies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            year INTEGER NOT NULL,
            title TEXT NOT NULL,
            winner BOOLEAN NOT NULL
          );
        `);

        db.run(`
          CREATE TABLE producers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
          );
        `);

        db.run(`
          CREATE TABLE movie_producers (
            movie_id INTEGER NOT NULL,
            producer_id INTEGER NOT NULL,
            FOREIGN KEY (movie_id) REFERENCES movies(id),
            FOREIGN KEY (producer_id) REFERENCES producers(id)
          );
        `);

        // Importação dos dados do CSV
        const csvFilePath = path.join(__dirname, '../data/movies.csv');
        const movies = [];

        fs.createReadStream(csvFilePath)
          .pipe(csv())
          .on('data', (row) => {
            movies.push(row);
          })
          .on('end', () => {
            console.log('Dados do CSV carregados.');
            populateDatabase(movies).then(resolve).catch(reject);
          });
      });
    });
  });
};

const populateDatabase = (movies) => {
  return new Promise((resolve, reject) => {
    const insertMovie = db.prepare(`
      INSERT INTO movies (title, year, winner) VALUES (?, ?, ?)
    `);

    const insertProducer = db.prepare(`
      INSERT OR IGNORE INTO producers (name) VALUES (?)
    `);

    const insertMovieProducer = db.prepare(`
      INSERT INTO movie_producers (movie_id, producer_id) VALUES (?, ?)
    `);

    db.serialize(() => {
      movies.forEach((movie) => {
        const { title, year, producers, winner } = movie;

        insertMovie.run(title, year, winner === 'yes' ? 1 : 0, function (err) {
          if (err) return reject(err);

          const movieId = this.lastID;
          const producerList = producers.split(',').map((p) => p.trim());

          producerList.forEach((producer) => {
            insertProducer.run(producer, function (err) {
              if (err) return reject(err);

              const producerId = this.lastID;
              insertMovieProducer.run(movieId, producerId);
            });
          });
        });
      });

      resolve();
    });
  });
};

const getDatabase = () => db;

module.exports = { initializeDatabase, getDatabase };
