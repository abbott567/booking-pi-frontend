const socketIo = require('socket.io');
const got = require('got');
const {checkTime, checkForBookings, getNextBooking} = require('./backend-functions');

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

module.exports = {connect};
