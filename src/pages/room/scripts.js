/* global io */

var socket = io.connect();

socket.on('updateTime', function () {
  $('#time').text(new Date().toISOString().substr(11, 5));
  socket.emit('checkBookings', '58a480dc825f024022e59d7a');
});

socket.on('roomBusy', function () {
  $('body').removeClass('free');
  $('body').addClass('busy');
});

socket.on('roomFree', function () {
  $('body').removeClass('busy');
  $('body').addClass('free');
});
