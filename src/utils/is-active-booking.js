'use strict';

module.exports = function (booking) {
  if (booking) {
    const now = new Date();

    return (new Date(booking.start) <= now && new Date(booking.end) > now);
  }
  return false;
};
