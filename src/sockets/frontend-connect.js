/* global io */
/* global moment */

var socket = io.connect();
var roomId = window.location.pathname;

$(document).ready(function () {
  socket.emit('newSocketConnection', roomId);
});

socket.on('initialPageLoad', function (room) {
  $('#roomName').text(room.name);
  updateStyles(room);
  updateMeetingInfo(room);
});

socket.on('updateTime', function () {
  $('#time').text(new Date().toISOString().substr(11, 5));
  socket.emit('updateBookings', roomId);
});

socket.on('updatePage', function (room) {
  updateStyles(room);
  updateMeetingInfo(room);
});

function updateStyles(room) {
  if (room.status === 'busy') {
    $('body').removeClass('free');
    $('body').addClass('busy');
    $('#availability').text('busy');
  } else {
    $('body').removeClass('busy');
    $('body').addClass('free');
    $('#availability').text('free');
  }
}

function updateMeetingInfo(room) {
  var $booking;
  if (room.status === 'busy') {
    $booking = room.currentBooking[0];
    $('#details h2').text('Meeting details:');
    $('#meeting-desc').text($booking.description);
    $('#meeting-name').text($booking.name);
    $('#meeting-time').text(
      moment($booking.start).format('HH:mm') + ' - ' + moment($booking.end).format('HH:mm')
    );
    $('#indent').show();
  } else if (room.status === 'freeForNow') {
    $booking = room.futureBookings[0];
    $('#details h2').text('Up next:');
    $('#meeting-desc').text($booking.description);
    $('#meeting-name').text($booking.name);
    $('#meeting-time').text(
      moment($booking.start).format('HH:mm') + ' - ' + moment($booking.end).format('HH:mm')
    );
    $('#indent').show();
  } else {
    $('#details h2').text('This room is free for the rest of today');
    $('#indent').hide();
  }
}
