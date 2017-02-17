'use strict';

const got = require('got');
const addDays = require('date-fns/add_days');
const formatDate = require('../utils/format-date');
const template = require('./template.marko');

const apiUrl = (process.env.API_URL || 'http://localhost:3000') + '/api';

module.exports = function (req, res, next) {
  const {roomId} = req.params;
  const today = new Date();
  const tomorrow = addDays(today, 1);

  got(`${apiUrl}/Rooms/${roomId}`, {
    json: true,
    query: {
      filter: JSON.stringify({
        include: {
          relation: 'bookings',
          scope: {
            order: 'start ASC',
            where: {
              and: [
                {start: {gt: formatDate(today)}},
                {start: {lt: formatDate(tomorrow)}}
              ]
            }
          }
        }
      })
    }
  })
  .then(response => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    template.render(response.body, res);
  })
  .catch(next);
};
