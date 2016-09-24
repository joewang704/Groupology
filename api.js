const request = require('request-promise')

const token = 'e24d3770640f0134076a19766f95137f'

const getMessages = () =>
  request({
    uri: 'https://api.groupme.com/v3/groups/11467991/messages',
    qs: {
      token,
      limit: 100,
    },
    json: 'true',
  }).then((res) => res.response.messages)

const getMembers = () =>
  request({
    uri: 'https://api.groupme.com/v3/groups/11467991',
    qs: {
      token,
    },
    json: 'true',
  }).then((res) => res.response.members)

exports.getMessages = getMessages
exports.getMembers = getMembers
