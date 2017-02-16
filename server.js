'use strict';

require('marko/node-require').install();

const bodyParser = require('body-parser');
const compression = require('compression');
const express = require('express');

// Configure Lasso.js
require('lasso').configure(require('./config/lasso'));

const app = express();
const port = process.env.PORT || 4000;

// Enable compression
app.use(compression());

// Disable x-powered-by header
app.disable('x-powered-by');

// Uptime ping end point
app.get('/ping', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send('pong');
});

// Serve static assets
app.use(require('lasso/middleware').serveStatic());

app.set('trust proxy', 1);

// Load Middleware
app.use(bodyParser.urlencoded({extended: true}));
// app.use(helmet(require('./config/helmet')));

// Set Content-Type header to text to make compression work for output stream
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  next();
});

// Page routes
app.use('/', require('./src/pages/room'));

// Listen!
app.listen(port, err => {
  if (err) {
    throw err;
  }

  console.log('Listening on port %d', port);
});
