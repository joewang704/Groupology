const pos = require('pos')
const MINUTE_LENGTH = 30
const moment = require('moment')

exports.measureParticipants = function(messages, members) {
  messages.forEach((element) => {
    const currMember = members[members.findIndex((member) => {
      return member['user_id'] === element['sender_id']
    })]
    currMember.count = (currMember.count === undefined ||
      currMember.count === null) ? 0 : currMember.count + 1
  })
  return members
}

exports.findLovers = function(messages, members) {
  //get message timestamps for each user
  let conversationTimes = new Object()
  members.forEach((member) => {
    messages.forEach((message) => {
      if (member['user_id'] === message['sender_id']) {
        let conversationArray = conversationTimes[member['user_id']]
        if (!conversationArray) {
          conversationTimes[member['user_id']] = []
          conversationArray = conversationTimes[member['user_id']]
        }
        conversationArray.push(message['created_at'])
      }
    })
  })
  //compare messages for each member, make adj list for convos between users
  let numConversations = new Object()
  members.forEach((member) => {
    members.forEach((secondMember) => {
      if (member !== secondMember) {
        const firstID = member['user_id']
        const secondID = secondMember['user_id']
        const firstChat = conversationTimes[firstID]
        const secondChat = conversationTimes[secondID]
        numConversations[firstID + secondID] =
                            countChats(firstChat, secondChat)
        numConversations[secondID + firstID] =
                            countChats(firstChat, secondChat)
      }
    })
  })
  // find the largest element in numConversations for lovers
  let max = -1
  let maxKey = ''
  Object.keys(numConversations).forEach((key) => {
    const curr = numConversations[key]
    if (max < curr) {
      max = curr
      maxKey = key
    }
  })
  const userId1 = maxKey.substring(0, maxKey.length / 2)
  const userId2 = maxKey.substring(maxKey.length / 2)
  return [{
    user_id: userId1,
    name: members.find((member) => member.user_id === userId1).nickname,
    img: members.find((member) => member.user_id === userId1).image_url
  }, {
    user_id: userId2,
    name: members.find((member) => member.user_id === userId2).nickname,
    img: members.find((member) => member.user_id === userId2).image_url
  }]
}

function countChats(firstChat, secondChat) {
  if (!firstChat || !secondChat) {
    return 0
  }
  let i = firstChat.length - 1
  let j = secondChat.length - 1
  let count = 0
  while (j > 0 && i > 0) {
    let diff = firstChat[i] - secondChat[j]
    if (Math.abs(diff) < 60 * 3) {
      ++count
      i--
      j--
    } else {
      if (diff > 0) {
        j--
      } else {
        i--
      }
    }
  }
  return count
}
