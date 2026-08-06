const express = require('express');
const db = require('../db');
const { requireAuth, requireAdmin } = require('../auth');

const router = express.Router();

router.get('/admin', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const pending = await db.queryAll(
      `SELECT deposit_requests.*, users.username AS username
       FROM deposit_requests
       JOIN users ON users.id = deposit_requests.user_id
       WHERE deposit_requests.status = 'pending'
       ORDER BY deposit_requests.confirmed_by_user DESC, deposit_requests.created_at ASC`
    );

    const recentDecided = await db.queryAll(
      `SELECT deposit_requests.*, users.username AS username
       FROM deposit_requests
       JOIN users ON users.id = deposit_requests.user_id
       WHERE deposit_requests.status != 'pending'
       ORDER BY deposit_requests.approved_at DESC
       LIMIT 20`
    );

    res.render('admin/dashboard', { pending, recentDecided });
  } catch (err) {
    next(err);
  }
});

async function approveRequest(requestId, amountVnd, coinCredited, adminId) {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      "SELECT * FROM deposit_requests WHERE id = $1 AND status = 'pending' FOR UPDATE",
      [requestId]
    );
    const request = rows[0];
    if (!request) {
      await client.query('ROLLBACK');
      return false;
    }

    await client.query(
      `UPDATE deposit_requests
       SET status = 'approved', amount_vnd = $1, coin_credited = $2, approved_by = $3, approved_at = now()
       WHERE id = $4`,
      [amountVnd, coinCredited, adminId, requestId]
    );
    await client.query('UPDATE users SET coin_balance = coin_balance + $1 WHERE id = $2', [
      coinCredited,
      request.user_id,
    ]);
    await client.query('COMMIT');
    return true;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

router.post('/admin/donate/:id/approve', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const requestId = Number(req.params.id);
    const amountVnd = Number(req.body.amount_vnd) || 0;
    const coinCredited = Number(req.body.coin_credited) || 0;
    await approveRequest(requestId, amountVnd, coinCredited, req.user.id);
    res.redirect('/admin');
  } catch (err) {
    next(err);
  }
});

router.post('/admin/donate/:id/reject', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const requestId = Number(req.params.id);
    await db.query(
      "UPDATE deposit_requests SET status = 'rejected', approved_by = $1, approved_at = now() WHERE id = $2 AND status = 'pending'",
      [req.user.id, requestId]
    );
    res.redirect('/admin');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
