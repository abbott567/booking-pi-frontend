'use strict';

const parseDateIgnoreTimezone = require('../utils/parse-date-ignore-timezone');

module.exports = function (booking) {
  if (booking) {
    const now = new Date();

    return (parseDateIgnoreTimezone(booking.start) <= now && parseDateIgnoreTimezone(booking.end) > now);
  }
  return false;
};
