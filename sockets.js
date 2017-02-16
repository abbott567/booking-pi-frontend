const socketIo = require('socket.io');
const got = require('got');

function connect(server) {
  let storedMinutes = new Date().getSeconds(); // mins
  const io = socketIo.listen(server);

  io.on('connection', socket => {
    console.log('New socket connection');

    socket.on('checkBookings', roomId => {
      return checkForBookings(roomId)
      .then(booked => {
        if (booked) {
          socket.emit('roomBusy');
        } else {
          socket.emit('roomFree');
        }
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
  }, 3000); // 1000
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
                {start: {gt: '2017-02-15'}},
                {start: {lt: '2017-02-16'}}
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
      return true;
    }
    return false;
  })
  .catch(err => {
    throw err;
  });
}

module.exports = {connect};
