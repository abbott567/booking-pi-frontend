'use strict';
const got = require('got');
const template = require('./template.marko');

function get(req, res) {
  template.render({}, res);
}

function hitApi(roomId) {
  return got(`http://localhost:3000/api/Rooms/${roomId}`, {
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
    console.log(response);
  })
  .catch(err => {
    throw err;
  });
}

module.exports = {get};
