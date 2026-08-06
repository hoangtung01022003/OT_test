const express = require('express');

const router = express.Router();

function buildGuestUser() {
  return {
    id: null,
    username: 'Guest',
    role: 'guest',
    coin_balance: 0,
  };
}

router.get(/\.aspx$/, (req, res, next) => {
  const legacyBaseUrl = (process.env.LEGACY_BASE_URL || '').replace(/\/$/, '');
  if (legacyBaseUrl) {
    return res.redirect(`${legacyBaseUrl}${req.originalUrl}`);
  }

  res.locals.currentUser = res.locals.currentUser || buildGuestUser();
  return res.render('legacy', { requestedPath: req.originalUrl });
});

module.exports = router;
