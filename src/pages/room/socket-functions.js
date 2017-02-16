/* global io */
/* global moment */

var socket = io.connect();

socket.on('updateRoomDetails', function (room) {
  $('#roomName').text(room.name);
});

socket.on('updateTime', function () {
  $('#time').text(new Date().toISOString().substr(11, 5));
  socket.emit('checkBookings', '58a480dc825f024022e59d7a');
});

socket.on('roomBusy', function (booking) {
  updateStyles(booking);
});

socket.on('roomFree', function () {
  updateStyles();
});

socket.on('updateNextBooking', function (bookings) {
  var booking = bookings[0];
  if (bookings.length === 0) {
    $('#details').html('<h2>This room is free for the rest of today</h2>');
  } else {
    $('#details').html(
      '<h2>Up next:</h2>' +
      '<div class="indent">' +
        '<span id="meeting-time">' +
          moment(booking.start).format('HH:mm') + ' - ' + moment(booking.end).format('HH:mm') +
        '</span><br />' +
        '<span id="meeting-desc">' + booking.description + '</span><br />' +
        '<span id="meeting-bookedBy">' + booking.name + '</span>' +
      '</div>'
    );
  }
});

$(document).ready(function () {
  socket.emit('getRoomDetails', '58a480dc825f024022e59d7a');
  socket.emit('checkBookings', '58a480dc825f024022e59d7a');
});

function updateStyles(booking) {
  if (booking) {
    $('body').removeClass('free');
    $('body').addClass('busy');
    $('#availability').text('busy');
    $('#details h2').text('Meeting details:');
    $('#details').html(
      '<h2>Meeting details:</h2>' +
      '<div class="indent">' +
        '<span id="meeting-time">' +
          moment(booking.start).format('HH:mm') + ' - ' + moment(booking.end).format('HH:mm') +
        '</span><br />' +
        '<span id="meeting-desc">' + booking.description + '</span><br />' +
        '<span id="meeting-bookedBy">' + booking.name + '</span>' +
      '</div>'
    );
  } else {
    $('body').removeClass('busy');
    $('body').addClass('free');
    $('#availability').text('free');
    socket.emit('getNextBooking', '58a480dc825f024022e59d7a');
  }
}
