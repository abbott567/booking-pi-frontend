const got = require('got');

function checkTime(storedMinutes, timeNow) {
  if (storedMinutes !== timeNow) {
    return true;
  }
}

function checkForBookings(roomId) {
  return got(`http://localhost:3000/api/Rooms/${roomId}`, {
    json: true,
    query: {
      filter: JSON.stringify({
        include: {
          relation: 'bookings',
          scope: {
            where: {
              and: [
                {start: {lt: new Date()}},
                {end: {gt: new Date()}}
              ]
            }
          }
        }
      })
    }
  })
  .then(response => {
    const booked = response.body.bookings.length > 0;
    if (booked) {
      return response.body.bookings[0];
    }
    return false;
  })
  .catch(err => {
    throw err;
  });
}

function getNextBooking(roomId) {
  return got(`http://localhost:3000/api/Rooms/${roomId}`, {
    json: true,
    query: {
      filter: JSON.stringify({
        include: {
          relation: 'bookings',
          scope: {
            where: {
              and: [
                {start: {gt: new Date()}},
                {start: {lt: '2017-02-17'}}
              ]
            }
          }
        }
      })
    }
  })
  .then(response => {
    const booked = response.body.bookings.length > 0;
    if (booked) {
      return response.body.bookings[0];
    }
    return false;
  })
  .catch(err => {
    throw err;
  });
}

module.exports = {checkTime, checkForBookings, getNextBooking};
