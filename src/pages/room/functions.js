'use strict';

const getRoomWithBookings = require('../../lib/get-room-with-bookings');
const template = require('./template.marko');

function get(req, res, next) {
  const {roomId} = req.params;
  const today = new Date();

  getRoomWithBookings(roomId, today)
    .then(response => template.render(response.body, res))
    .catch(next);
}

module.exports = {get};
