'use strict';

module.exports = function (bookings) {
  const now = new Date();

  return bookings.filter(booking => new Date(booking.end) > now)[0];
};
