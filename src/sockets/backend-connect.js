const socketIo = require('socket.io');
const getRoomWithBookings = require('../lib/get-room-with-bookings');
const {checkTime, sortBookings, setRoomStatus} = require('./backend-functions');

function connect(server) {
  const io = socketIo.listen(server);
  const minutes = {storedMinutes: new Date().getSeconds()};

  io.on('connection', socket => {
    console.log('New socket connection');

    socket.on('newSocketConnection', roomId => {
      const today = new Date();
      return getRoomWithBookings(roomId, today)
      .then(sortBookings)
      .then(setRoomStatus)
      .then(response => {
        socket.emit('initialPageLoad', response);
      })
      .catch(err => {
        console.log(err);
      });
    });

    socket.on('updateBookings', roomId => {
      const today = new Date();
      return getRoomWithBookings(roomId, today)
      .then(sortBookings)
      .then(setRoomStatus)
      .then(response => {
        socket.emit('updatePage', response);
      })
      .catch(err => {
        console.log(err);
      });
    });
  });

  setInterval(() => {
    minutes.newMinutes = new Date().getSeconds();
    const timeHasChanged = checkTime(minutes.storedMinutes, minutes.newMinutes);
    if (timeHasChanged) {
      minutes.storedMinutes = minutes.newMinutes;
      io.emit('updateTime');
    }
  }, 3000);
}

module.exports = {connect};
