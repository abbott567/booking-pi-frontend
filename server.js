'use strict';

require('marko/node-require').install();
require('lasso').configure(require('./lasso'));

const compression = require('compression');
const express = require('express');

const app = express();
const port = process.env.PORT || 4000;
const maxage = 31536000;

app.use(compression());
app.disable('x-powered-by');
app.use(require('lasso/middleware').serveStatic({sendOptions: {maxage}}));

app.get('/:roomId', require('./src/page'));

app.listen(port, err => {
  if (err) {
    throw err;
  }

  console.log('Listening on port %d', port);
});
