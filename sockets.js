const socketIo = require('socket.io');
const got = require('got');

function connect(server) {
  let storedMinutes = new Date().getSeconds(); // mins
  const io = socketIo.listen(server);

  io.on('connection', socket => {
    console.log('New socket connection');

    socket.on('getRoomDetails', roomId => {
      return got(`http://localhost:3000/api/Rooms/${roomId}`, {
        json: true
      })
      .then(response => {
        socket.emit('updateRoomDetails', response.body);
      })
      .catch(err => {
        throw err;
      });
    });

    socket.on('checkBookings', roomId => {
      return checkForBookings(roomId)
      .then(booked => {
        if (booked) {
          socket.emit('roomBusy', booked);
        } else {
          socket.emit('roomFree');
        }
      })
      .catch(err => {
        throw err;
      });
    });

    socket.on('getNextBooking', roomId => {
      return getNextBooking(roomId, {json: true})
      .then(bookings => {
        socket.emit('updateNextBooking', bookings);
      })
      .catch(err => {
        throw err;
      });
    });
  });

  setInterval(() => {
    const newMinutes = new Date().getSeconds(); // mins
    const timeHasChanged = checkTime(storedMinutes, newMinutes);
    if (timeHasChanged) {
      storedMinutes = newMinutes;
      io.emit('updateTime');
    }
  }, 3000);
}

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
    return response.body.bookings;
  })
  .catch(err => {
    throw err;
  });
}

module.exports = {connect};
