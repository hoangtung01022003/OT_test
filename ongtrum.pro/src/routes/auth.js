const express = require('express');
const { findByUsername, createUser, verifyPassword } = require('../auth');

const router = express.Router();

router.get(['/login', '/login.aspx'], (req, res) => {
  if (req.session.userId) return res.redirect('/donate');
  res.render('login', { error: null });
});

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await findByUsername(username || '');
    if (!user || !verifyPassword(user, password || '')) {
      return res.render('login', { error: 'Sai t&#234;n &#273;&#259;ng nh&#7853;p ho&#7863;c m&#7853;t kh&#7849;u.' });
    }
    req.session.userId = user.id;
    res.redirect(user.role === 'admin' ? '/admin' : '/donate');
  } catch (err) {
    next(err);
  }
});

router.get(['/register', '/register.aspx'], (req, res) => {
  if (req.session.userId) return res.redirect('/donate');
  res.render('register', { error: null });
});

router.post('/register', async (req, res, next) => {
  try {
    const { username, password, password2 } = req.body;
    if (!username || !password) {
      return res.render('register', { error: 'Vui l&#242;ng nh&#7853;p &#273;&#7847;y &#273;&#7911; th&#244;ng tin.' });
    }
    if (password !== password2) {
      return res.render('register', { error: 'M&#7853;t kh&#7849;u nh&#7853;p l&#7841;i kh&#244;ng kh&#7899;p.' });
    }
    if (await findByUsername(username)) {
      return res.render('register', { error: 'T&#234;n &#273;&#259;ng nh&#7853;p &#273;&#227; t&#7891;n t&#7841;i.' });
    }
    const user = await createUser(username, password);
    req.session.userId = user.id;
    res.redirect('/donate');
  } catch (err) {
    next(err);
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login.aspx'));
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login.aspx'));
});

module.exports = router;
