'use strict';

const got = require('got');
const addDays = require('date-fns/add_days');
const template = require('./template.marko');

const apiUrl = (process.env.API_URL || 'https://room-bookings-api.herokuapp.com') + '/api';

module.exports = function (req, res) {
  const roomId = req.path.substr(1);
  const now = new Date();
  const today = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
  const tomorrow = addDays(today, 1);

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
                  {end: {gt: today.toISOString()}},
                  {end: {lt: tomorrow.toISOString().substr(0, 10)}}
                ]
              }
            }
          }
        })
      }
    })
  }, res);
};
