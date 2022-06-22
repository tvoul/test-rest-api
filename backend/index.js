const path = require('path');
const betterSqlite3 = require('better-sqlite3');
const db = betterSqlite3('./backend/database/shop.db');
const port = process.env.PORT || 3000;
const express = require('express');

const app = express();

app.use(express.static('frontend'));

app.use(express.json({ limit: '100MB' }));

app.listen(port, () =>
  console.log('Listening on http://localhost:' + port));
const login = require('./login.js');

login(app, db);

const setupRESTapi = require('./rest-api');
setupRESTapi(app, db);

app.all('*', (req, res) => {
  res.status(404);
  res.set('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, '../frontend', '404.html'));
});