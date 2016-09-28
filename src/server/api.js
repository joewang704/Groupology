const request = require('request-promise')

const getMessages = (token, groupId) =>
  request({
    uri: `https://api.groupme.com/v3/groups/${groupId}/messages`,
    qs: {
      token,
      limit: 100,
    },
    json: 'true',
  }).then((res) => res.response.messages.filter((({ system }) => !system)))

const getMembers = (token, groupId) =>
  request({
    uri: `https://api.groupme.com/v3/groups/${groupId}`,
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
