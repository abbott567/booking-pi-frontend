const got = require('got');
const addDays = require('date-fns/add_days');

function checkTime(storedMinutes, timeNow) {
  if (storedMinutes !== timeNow) {
    return true;
  }
}

function formatDate(date) {
  return date.toISOString().substr(0, 10);
}

function getRoomWithBookings(roomId) {
  const today = new Date();
  const tomorrow = addDays(today, 1);
  return got(`http://localhost:3000/api/Rooms/${roomId}`, {
    json: true,
    query: {
      filter: JSON.stringify({
        include: {
          relation: 'bookings',
          scope: {
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
    const room = response.body;
    sortBookings(room);
    setRoomStatus(room);
    return room;
  })
  .catch(err => {
    throw err;
  });
}

function setRoomStatus(room) {
  if (room.currentBooking.length > 0) {
    room.status = 'busy';
  } else if (room.futureBookings.length > 0) {
    room.status = 'freeForNow';
  } else {
    room.status = 'freeAllDay';
  }
  return room;
}

function sortBookings(room) {
  const timeNow = new Date();
  room.prevBookings = [];
  room.futureBookings = [];
  room.currentBooking = [];
  if (room.bookings.length > 0) {
    for (let i = 0; i < room.bookings.length; i++) {
      const start = new Date(room.bookings[i].start);
      const end = new Date(room.bookings[i].end);
      if (start < timeNow && end < timeNow) {
        room.prevBookings.push(room.bookings[i]);
      } else if (start > timeNow && end > timeNow) {
        room.futureBookings.push(room.bookings[i]);
      } else {
        room.currentBooking.push(room.bookings[i]);
      }
    }
  }
  return room;
}

module.exports = {checkTime, getRoomWithBookings};
