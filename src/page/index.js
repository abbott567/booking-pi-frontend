'use strict';

const got = require('got');
const addDays = require('date-fns/add_days');
const addMinutes = require('date-fns/add_minutes');
const template = require('./template.marko');

const apiUrl = (process.env.API_URL || 'http://localhost:3000') + '/api';

module.exports = function (req, res) {
  const roomId = req.path.substr(1);
  const today = new Date();
  const todayDSTISOString = addMinutes(today, today.getTimezoneOffset() * -1).toISOString();
  const tomorrowDateString = addDays(today, 1).toISOString().substr(0, 10);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  template.render({
    apiRequest: got(`${apiUrl}/Rooms/${roomId}`, {
      json: true,
      query: {
        filter: JSON.stringify({
          limit: 1,
          include: {
            relation: 'bookings',
            scope: {
              order: 'start ASC',
              where: {
                and: [
                  {end: {gt: todayDSTISOString}},
                  {end: {lt: tomorrowDateString}}
                ]
              }
            }
          }
        })
      }
    })
  }, res);
};
