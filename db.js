const sqlite3 = require('sqlite3').verbose();

// Database connection
const db = new sqlite3.Database('coding_tracker.db', (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to the database.");
    createTables();
  }
});

// Function to create tables
function createTables() {
  db.serialize(() => {
    // Create users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT UNIQUE
      )
    `);

    // Create coding_logs table
    db.run(`
      CREATE TABLE IF NOT EXISTS coding_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        time REAL NOT NULL,
        language TEXT NOT NULL,
        topic TEXT NOT NULL,
        notes TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Create goals table
    db.run(`
      CREATE TABLE IF NOT EXISTS goals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        goal_type TEXT NOT NULL,
        target_hours REAL NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
  });
}

// Export the database connection
module.exports = db;
