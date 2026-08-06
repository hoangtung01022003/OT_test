const express = require('express');
const { requireAuth } = require('../auth');

const router = express.Router();

router.get(/\.aspx$/, (req, res, next) => {
  const legacyBaseUrl = (process.env.LEGACY_BASE_URL || '').replace(/\/$/, '');
  if (legacyBaseUrl) {
    return res.redirect(`${legacyBaseUrl}${req.originalUrl}`);
  }

  return requireAuth(req, res, () => {
    res.render('legacy', { requestedPath: req.originalUrl });
  });
});

module.exports = router;
