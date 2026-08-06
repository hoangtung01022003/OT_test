const express = require('express');
const db = require('../db');
const { requireAuth } = require('../auth');
const {
  buildVietQrUrl,
  DEFAULT_ACCOUNT_NO,
  DEFAULT_TRANSFER_PREFIX,
  DEFAULT_ACCOUNT_NAME,
  DEFAULT_BANK_CODE,
  DEFAULT_BANK_NAME,
} = require('../vietqr');

const router = express.Router();

function generateCode() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `OT${n}`;
}

async function createBankRequest(userId) {
  let code;
  let existing;
  for (let i = 0; i < 10; i += 1) {
    code = generateCode();
    existing = await db.queryOne('SELECT id FROM deposit_requests WHERE code = $1', [code]);
    if (!existing) break;
  }

  const content = `${DEFAULT_TRANSFER_PREFIX} ${code}`;
  return db.queryOne(
    'INSERT INTO deposit_requests (user_id, code, content) VALUES ($1, $2, $3) RETURNING *',
    [userId, code, content]
  );
}

async function getHistory(userId) {
  return db.queryAll('SELECT * FROM deposit_requests WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
}

function bankViewModel(request) {
  if (!request) return null;
  return {
    request,
    qrUrl: buildVietQrUrl({ amount: request.amount_hint, content: request.content }),
    bank: {
      accountNo: DEFAULT_ACCOUNT_NO,
      transferPrefix: DEFAULT_TRANSFER_PREFIX,
      accountName: DEFAULT_ACCOUNT_NAME,
      bankCode: DEFAULT_BANK_CODE,
      bankName: DEFAULT_BANK_NAME,
    },
  };
}

router.get('/donate', requireAuth, async (req, res, next) => {
  try {
    res.render('donate', {
      mode: 'choose',
      bankInfo: null,
      history: await getHistory(req.user.id),
    });
  } catch (err) {
    next(err);
  }
});

router.post('/donate/atm', requireAuth, async (req, res, next) => {
  try {
    const request = await createBankRequest(req.user.id);
    res.redirect(`/donate/atm/${request.id}`);
  } catch (err) {
    next(err);
  }
});

router.get('/donate/atm/:id', requireAuth, async (req, res, next) => {
  try {
    const request = await db.queryOne(
      'SELECT * FROM deposit_requests WHERE id = $1 AND user_id = $2',
      [Number(req.params.id), req.user.id]
    );
    if (!request) return res.redirect('/donate');

    res.render('donate', {
      mode: 'bank',
      bankInfo: bankViewModel(request),
      history: await getHistory(req.user.id),
    });
  } catch (err) {
    next(err);
  }
});

router.post('/donate/confirm', requireAuth, async (req, res, next) => {
  try {
    const requestId = Number(req.body.request_id);
    const amount = Number(req.body.amount) || null;
    await db.query(
      `UPDATE deposit_requests
       SET confirmed_by_user = true, confirmed_at = now(), amount_hint = COALESCE($1, amount_hint)
       WHERE id = $2 AND user_id = $3 AND status = 'pending'`,
      [amount, requestId, req.user.id]
    );
    res.redirect(`/donate/atm/${requestId}`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
