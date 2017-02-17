/* global io */
/* global moment */

var socket = io.connect();

$(document).ready(function () {
  socket.emit('getRoomDetails', '58a480dc825f024022e59d7a');
  socket.emit('checkBookings', '58a480dc825f024022e59d7a');
});

socket.on('updateRoomDetails', function (room) {
  $('#roomName').text(room.name);
});

socket.on('updateTime', function () {
  $('#time').text(new Date().toISOString().substr(11, 5));
  socket.emit('checkBookings', '58a480dc825f024022e59d7a');
});

socket.on('roomBusy', function (booking) {
  updateStyles('busy');
  updateMeetingInfo('busy', booking);
});

socket.on('roomFree', function () {
  updateStyles('free');
  updateMeetingInfo('free');
});

socket.on('updateNextBooking', function (bookings) {
  updateMeetingInfo('free', bookings);
});

function updateStyles(status) {
  if (status === 'busy') {
    $('body').removeClass('free');
    $('body').addClass('busy');
    $('#availability').text('busy');
  } else {
    $('body').removeClass('busy');
    $('body').addClass('free');
    $('#availability').text('free');
  }
}

function updateMeetingInfo(status, booking) {
  if (booking) {
    var h2 = 'Up next';
    if (status === 'busy') {
      h2 = 'Meeting details:';
    }
    $('#details').html(
      '<h2>' + h2 + '</h2>' +
      '<div class="indent">' +
        '<span id="meeting-time">' +
          moment(booking.start).format('HH:mm') + ' - ' + moment(booking.end).format('HH:mm') +
        '</span><br />' +
        '<span id="meeting-desc">' + booking.description + '</span><br />' +
        '<span id="meeting-bookedBy">' + booking.name + '</span>' +
      '</div>'
    );
  } else {
    $('#details').html('<h2>This room is free for the rest of today</h2>');
  }
}
