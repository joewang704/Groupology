const request = require('request-promise')

const getMessages = () =>
  request({
    uri: 'https://api.groupme.com/v3/groups/11467991/messages',
    qs: {
      token: 'e24d3770640f0134076a19766f95137f',
      limit: 100,
    },
    json: 'true',
  })

exports.getMessages = getMessages
