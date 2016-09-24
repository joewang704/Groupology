const pos = require('pos')
const MINUTE_LENGTH = 30
const moment = require('moment')

exports.measureParticipants = function(messages, members) {
  messages.forEach((element) => {
    if (!isNaN(element['sender_id'])) {
      const currMember = members[members.findIndex((member) => {
        return member['user_id'] === element['sender_id']
      })]
      currMember.count = (currMember.count === undefined ||
        currMember.count === null) ? 0 : currMember.count + 1
    }
  })
  return members
}


exports.findLovers = function(messages, members) {
  //compare messages for each member, make adj list for convos between users
  const frequentConvos = logFrequentChatPairs(messages, members)
  // find the largest element in frequentConvos for lovers
  let max = -1
  let maxKey = ''
  Object.keys(frequentConvos).forEach((key) => {
    const curr = frequentConvos[key].count
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
 
exports.findMostPopular = function(messages, members) {
  popularPeople = {} 
  const frequentConvos = logFrequentChatPairs(messages, members)
  members.forEach((member) => {
    members.forEach((secondMember) => {
      if (member !== secondMember) {
        const firstID = member['user_id']
        const secondID = secondMember['user_id']
        if (!popularPeople[firstID]) {
          popularPeople[firstID] = {count:0,
                                    messages: new Set()} 
        }
        popularPeople[firstID].count += frequentConvos[firstID + secondID].count
        frequentConvos[firstID + secondID]
        .messageTimeStamps
        .forEach((timeStamp) => {
          popularPeople[firstID].messages.add(
          messages.find((message) => {
            return parseInt(message.created_at) === parseInt(timeStamp)
          }).text)
        })
      }
    })
  })
  //convert set to array
  members.forEach((member) => {
    const firstID = member['user_id']
    popularPeople[firstID].messages = Array.from(popularPeople[firstID].messages)
  })
  //find most popular person with correct name
  let max = -1
  let maxKey = ''
  Object.keys(popularPeople).forEach((key) => {
    const curr = popularPeople[key].count
    if (max < curr) {
      max = curr
      maxKey = key
    }
  })
  const userId = maxKey
  return [{
    user_id: userId,
    name: members.find((member) => member.user_id === userId).nickname,
    messages: popularPeople[userId].messages
  }]
}
    

function logFrequentChatPairs(messages, members) {
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
  let frequentConvos = new Object()
  members.forEach((member) => {
    members.forEach((secondMember) => {
      if (member !== secondMember) {
        const firstID = member['user_id']
        const secondID = secondMember['user_id']
        const firstChat = conversationTimes[firstID]
        const secondChat = conversationTimes[secondID]
        frequentConvos[firstID + secondID] =
                            logFrequentChats(firstChat, secondChat)
        frequentConvos[secondID + firstID] = frequentConvos[firstID + secondID]
      }
    })
  })
  return frequentConvos
}

function logFrequentChats(firstChat, secondChat) {
  let count = 0
  let messageTimeStamps = []
  if (!firstChat || !secondChat) {
    return {messageTimeStamps, count}
  }
  let i = firstChat.length - 1
  let j = secondChat.length - 1
  while (j > 0 && i > 0) {
    let diff = firstChat[i] - secondChat[j]
    if (Math.abs(diff) < 60 * 3) {
      ++count
      messageTimeStamps.push(firstChat[i])
      messageTimeStamps.push(secondChat[j])
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
  return {messageTimeStamps, count}
}
