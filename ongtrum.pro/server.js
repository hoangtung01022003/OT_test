require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');

const db = require('./src/db');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
  })
);

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/cdn-cgi', express.static(path.join(__dirname, 'cdn-cgi')));

app.get('/', (req, res) => res.redirect(req.session.userId ? '/donate' : '/login.aspx'));

app.use(require('./src/routes/auth'));
app.use(require('./src/routes/donate'));
app.use(require('./src/routes/admin'));
app.use(require('./src/routes/legacy'));

const PORT = process.env.PORT || 3000;
db.init()
  .then(() => {
    app.listen(PORT, () => console.log(`ongtrum.pro app listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
