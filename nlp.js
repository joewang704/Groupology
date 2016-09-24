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
  // members.total = messages.length
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
        //console.log("SECOND ID:")
        //console.log(secondID)
        const firstChat = conversationTimes[firstID]
        const secondChat = conversationTimes[secondID]
        numConversations[firstID + secondID] =
                            countChats(firstChat, secondChat)
        numConversations[secondID + firstID] =
                            countChats(firstChat, secondChat)
      }
    })
  })
  return numConversations
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
    console.log(diff)
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
