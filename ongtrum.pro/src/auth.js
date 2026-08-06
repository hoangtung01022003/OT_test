const bcrypt = require('bcryptjs');
const db = require('./db');

async function findByUsername(username) {
  return db.queryOne('SELECT * FROM users WHERE username = $1', [username]);
}

async function createUser(username, password) {
  const password_hash = bcrypt.hashSync(password, 10);
  return db.queryOne(
    'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *',
    [username, password_hash]
  );
}

function verifyPassword(user, password) {
  return bcrypt.compareSync(password, user.password_hash);
}

async function currentUser(req) {
  if (!req.session.userId) return null;
  return db.queryOne('SELECT * FROM users WHERE id = $1', [req.session.userId]);
}

async function requireAuth(req, res, next) {
  const user = await currentUser(req);
  if (!user) return res.redirect('/login.aspx');
  req.user = user;
  res.locals.currentUser = user;
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') return res.status(403).send('Forbidden');
  next();
}

module.exports = {
  findByUsername,
  createUser,
  verifyPassword,
  currentUser,
  requireAuth,
  requireAdmin,
};
