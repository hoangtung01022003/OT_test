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

async function buildAtmDraft() {
  let code;
  let existing;
  for (let i = 0; i < 10; i += 1) {
    code = generateCode();
    existing = await db.queryOne('SELECT id FROM deposit_requests WHERE code = $1', [code]);
    if (!existing) break;
  }

  return { code, content: `${DEFAULT_TRANSFER_PREFIX} ${code}` };
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
    req.session.atmDraft = await buildAtmDraft();
    res.redirect('/donate/atm');
  } catch (err) {
    next(err);
  }
});

// Nothing is written to the DB until the user actually submits "DA CHUYEN" below,
// so simply reloading/F5-ing this page never creates duplicate pending rows.
router.get('/donate/atm', requireAuth, async (req, res, next) => {
  try {
    const draft = req.session.atmDraft;
    if (!draft) return res.redirect('/donate');

    res.render('donate', {
      mode: 'bank',
      bankInfo: bankViewModel({
        id: null,
        content: draft.content,
        amount_hint: null,
        confirmed_by_user: false,
      }),
      history: await getHistory(req.user.id),
    });
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
    const draft = req.session.atmDraft;
    if (!draft) return res.redirect('/donate');

    const amount = Number(req.body.amount) || null;
    const request = await db.queryOne(
      `INSERT INTO deposit_requests (user_id, code, content, amount_hint, confirmed_by_user, confirmed_at)
       VALUES ($1, $2, $3, $4, true, now())
       RETURNING *`,
      [req.user.id, draft.code, draft.content, amount]
    );
    delete req.session.atmDraft;
    res.redirect(`/donate/atm/${request.id}`);
  } catch (err) {
    next(err);
  }
});

router.get('/donate/notify/check', requireAuth, async (req, res, next) => {
  try {
    const notice = await db.queryOne(
      `SELECT id, coin_credited FROM deposit_requests
       WHERE user_id = $1 AND status = 'approved' AND notified = false
       ORDER BY approved_at ASC LIMIT 1`,
      [req.user.id]
    );
    res.json({ notice });
  } catch (err) {
    next(err);
  }
});

router.post('/donate/notify/ack', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.body.id);
    await db.query(
      "UPDATE deposit_requests SET notified = true WHERE id = $1 AND user_id = $2 AND status = 'approved'",
      [id, req.user.id]
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
