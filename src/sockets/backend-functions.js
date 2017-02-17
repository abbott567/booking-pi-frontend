function checkTime(storedMinutes, timeNow) {
  if (storedMinutes !== timeNow) {
    return true;
  }
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

function sortBookings(response) {
  const room = response.body;
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

module.exports = {checkTime, sortBookings, setRoomStatus};
