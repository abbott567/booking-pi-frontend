const socketIo = require('socket.io');
const {checkTime, getRoomWithBookings} = require('./backend-functions');

function connect(server) {
  const io = socketIo.listen(server);
  const minutes = {storedMinutes: new Date().getSeconds()};

  io.on('connection', socket => {
    console.log('New socket connection');

    socket.on('newSocketConnection', roomId => {
      return getRoomWithBookings(roomId)
      .then(response => {
        socket.emit('initialPageLoad', response);
      })
      .catch(err => {
        console.log(err);
      });
    });

    socket.on('updateBookings', roomId => {
      return getRoomWithBookings(roomId)
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
