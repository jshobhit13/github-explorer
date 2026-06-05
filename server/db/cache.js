const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "..", "cache.db"));

// Create cache table on first run
db.exec(`
  CREATE TABLE IF NOT EXISTS cache (
    key       TEXT PRIMARY KEY,
    value     TEXT NOT NULL,
    cached_at INTEGER NOT NULL
  )
`);

const TTL_MS = 60 * 1000; // 60 seconds

function get(key) {
  const row = db.prepare("SELECT value, cached_at FROM cache WHERE key = ?").get(key);
  if (!row) return null;
  if (Date.now() - row.cached_at > TTL_MS) {
    db.prepare("DELETE FROM cache WHERE key = ?").run(key);
    return null;
  }
  return JSON.parse(row.value);
}

function set(key, value) {
  db.prepare(
    "INSERT OR REPLACE INTO cache (key, value, cached_at) VALUES (?, ?, ?)"
  ).run(key, JSON.stringify(value), Date.now());
}

// Purge expired rows — run on startup so the DB stays lean
function purgeExpired() {
  db.prepare("DELETE FROM cache WHERE cached_at < ?").run(Date.now() - TTL_MS);
}

purgeExpired();

module.exports = { get, set };
