import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { Low, JSONFile } from 'lowdb';

const dbPath = path.resolve('db.json');
const adapter = new JSONFile(dbPath);
const db = new Low(adapter);

export const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    const movies = [];

    fs.createReadStream(path.resolve('data/movies.csv'))
      .pipe(csv())
      .on('data', (row) => {
        movies.push(row);
      })
      .on('end', () => {
        db.data ||= { movies: [] };
        db.data.movies.push(...movies);
        db.write()
          .then(resolve)
          .catch(reject);
      })
      .on('error', reject);
  });
};

export const getMovies = () => {
  return db.data?.movies || [];
};
