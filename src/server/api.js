const request = require('request-promise')

//const token = 'e24d3770640f0134076a19766f95137f'
//const token = '08355a20649b0134076a19766f95137f'

const getMessages = (token, groupId) =>
  request({
    uri: `https://api.groupme.com/v3/groups/${groupId}/messages`,
    //uri: 'https://api.groupme.com/v3/groups/13817068/messages',
    qs: {
      token,
      limit: 100,
    },
    json: 'true',
  }).then((res) => res.response.messages)

const getMembers = (token, groupId) =>
  request({
    uri: `https://api.groupme.com/v3/groups/${groupId}`,
    //uri: 'https://api.groupme.com/v3/groups/13817068',
    qs: {
      token,
    },
    json: 'true',
  }).then((res) => res.response.members)

const getGroups = (token) =>
  request({
    uri: 'https://api.groupme.com/v3/groups',
    qs: {
      token,
    },
    json: 'true',
  }).then((res) => res.response)

exports.getMessages = getMessages
exports.getMembers = getMembers
exports.getGroups = getGroups
