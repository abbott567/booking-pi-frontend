const socketIo = require('socket.io');
const {checkTime, getRoomWithBookings} = require('./backend-functions');

function connect(server) {
  let storedMinutes = new Date().getSeconds(); // mins
  const io = socketIo.listen(server);

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
    const newMinutes = new Date().getSeconds(); // mins
    const timeHasChanged = checkTime(storedMinutes, newMinutes);
    if (timeHasChanged) {
      storedMinutes = newMinutes;
      io.emit('updateTime');
    }
  }, 3000);
}

module.exports = {connect};
