/* global io */
/* global moment */

var socket = io.connect();

$(document).ready(function () {
  socket.emit('newSocketConnection', '58a480dc825f024022e59d7a');
});

socket.on('initialPageLoad', function (room) {
  $('#roomName').text(room.name);
  updateStyles(room);
  updateMeetingInfo(room);
});

socket.on('updateTime', function () {
  $('#time').text(new Date().toISOString().substr(11, 5));
  socket.emit('updateBookings', '58a480dc825f024022e59d7a');
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
  var html;
  if (room.status === 'busy') {
    html = '<h2>Meeting details:</h2>' +
    '<div class="indent">' +
      '<span id="meeting-time">' +
        moment(room.currentBooking[0].start).format('HH:mm') + ' - ' + moment(room.currentBooking[0].end).format('HH:mm') +
      '</span><br />' +
      '<span id="meeting-desc">' + room.currentBooking[0].description + '</span><br />' +
      '<span id="meeting-bookedBy">' + room.currentBooking[0].name + '</span>' +
    '</div>';
  } else if (room.status === 'freeForNow') {
    html = '<h2>Meeting details:</h2>' +
    '<div class="indent">' +
      '<span id="meeting-time">' +
        moment(room.futureBookings[0].start).format('HH:mm') + ' - ' + moment(room.futureBookings[0].end).format('HH:mm') +
      '</span><br />' +
      '<span id="meeting-desc">' + room.futureBookings[0].description + '</span><br />' +
      '<span id="meeting-bookedBy">' + room.futureBookings[0].name + '</span>' +
    '</div>';
  } else {
    html = '<h2>This room is free for the rest of today</h2>';
  }
  $('#details').html(html);
}
