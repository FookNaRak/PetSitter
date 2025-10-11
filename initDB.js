const db = require('./database');

// Users
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
)`);

// Sitters
db.run(`CREATE TABLE sitters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT,
    experience INTEGER,
    price INTEGER,
    location TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
)`);

// Bookings
db.run(`CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  sitter_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(sitter_id) REFERENCES sitters(id)
)`);

// Reviews
db.run(`CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sitter_id INTEGER,
    user_id INTEGER,
    rating INTEGER,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sitter_id) REFERENCES sitters(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
)`);

console.log('Tables created.');
db.close();
