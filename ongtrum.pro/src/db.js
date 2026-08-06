const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function query(text, params) {
  return pool.query(text, params);
}

async function queryOne(text, params) {
  const { rows } = await pool.query(text, params);
  return rows[0] || null;
}

async function queryAll(text, params) {
  const { rows } = await pool.query(text, params);
  return rows;
}

async function initSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      coin_balance INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS deposit_requests (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      code TEXT NOT NULL,
      content TEXT NOT NULL,
      amount_hint INTEGER,
      status TEXT NOT NULL DEFAULT 'pending',
      confirmed_by_user BOOLEAN NOT NULL DEFAULT false,
      confirmed_at TIMESTAMPTZ,
      amount_vnd INTEGER,
      coin_credited INTEGER,
      approved_by INTEGER,
      approved_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    ALTER TABLE deposit_requests ADD COLUMN IF NOT EXISTS notified BOOLEAN NOT NULL DEFAULT false;

    ALTER TABLE users ALTER COLUMN coin_balance TYPE BIGINT;
    ALTER TABLE deposit_requests ALTER COLUMN amount_hint TYPE BIGINT;
    ALTER TABLE deposit_requests ALTER COLUMN amount_vnd TYPE BIGINT;
    ALTER TABLE deposit_requests ALTER COLUMN coin_credited TYPE BIGINT;
  `);
}

async function seedAdmin() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) return;

  const existing = await queryOne('SELECT id FROM users WHERE username = $1', [username]);
  if (existing) {
    await query("UPDATE users SET role = 'admin' WHERE id = $1", [existing.id]);
    return;
  }
  const password_hash = bcrypt.hashSync(password, 10);
  await query(
    "INSERT INTO users (username, password_hash, role) VALUES ($1, $2, 'admin')",
    [username, password_hash]
  );
}

async function init() {
  await initSchema();
  await seedAdmin();
}

module.exports = { pool, query, queryOne, queryAll, init };
