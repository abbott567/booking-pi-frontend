'use strict';

const got = require('got');
const addDays = require('date-fns/add_days');
const formatDate = require('../utils/format-date');

const apiUrl = (process.env.API_URL || 'http://localhost:3000') + '/api';

module.exports = function (id, date) {
  const nextDay = addDays(date, 1);

  return got(`${apiUrl}/Rooms/${id}`, {
    json: true,
    query: {
      filter: JSON.stringify({
        include: {
          relation: 'bookings',
          scope: {
            order: 'start ASC',
            where: {
              and: [
                {start: {gt: formatDate(date)}},
                {start: {lt: formatDate(nextDay)}}
              ]
            }
          }
        }
      })
    }
  });
};
