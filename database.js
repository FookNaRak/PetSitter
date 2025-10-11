const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db_name = path.join(__dirname, 'data', 'petsitter.db');
const db = new sqlite3.Database(db_name, (err) => {
  if (err) console.error(err.message);
  else console.log('Connected to SQLite database.');
});

module.exports = db;
