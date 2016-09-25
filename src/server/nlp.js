"use strict"
const pos = require('pos')
const MINUTE_LENGTH = 30
const moment = require('moment')
const sentiment = require('sentiment')

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

exports.plotDensity = function(messages) {
  //get earliest and latest times
  var times = messages.map(function(msg) {return msg['created_at']})
  var names = messages.map(function(msg) {return msg['name']})
  var earliest = moment.unix(Math.min.apply(null, times))
  var latest = moment.unix(Math.max.apply(null, times))
  names = names.filter(function(item, pos) {
        return names.indexOf(item) == pos;
  })

  //initialize
  var stackedData = []
  for (var i = 0; i < 24; i++) {
    var toAdd = {}
    names.forEach((name) => {
      var curr = {[name] : 0}
      Object.assign(toAdd, curr)
    })
    var currHour = {'hour': hourConverter(i)}
    Object.assign(currHour, toAdd)
    stackedData.push(currHour)
  }


  messages.forEach((msg) => {
    var hour = parseInt(moment.unix(msg['created_at']).format("HH"))
    var name = msg['name']
    stackedData[hour][name] += 1
  })

  //find number of bins
  var hours = latest.diff(earliest, 'hours')
  var days = latest.diff(earliest, 'days')
  var months = latest.diff(earliest, 'months')

  return {
      names: names,
      toPlot: stackedData
    }
  }


function hourConverter(hh) {
  var num = parseInt(hh)
  if (num > 12) {
    return (num - 12) + ":00 PM"
  } else if (num == 0) {
    return "12:00 AM"
  } else {
    return hh + ":00 AM"
  }
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
                                    messages: new Set(),
                                    sentMessages: new Set(),
                                    totalSentiment: 0,
                                    internalSentiment: 0}
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
        frequentConvos[firstID + secondID]
        .selfTimeStamps
        .forEach((timeStamp) => {
          popularPeople[firstID].sentMessages.add(
          messages.find((message) => {
            return parseInt(message.created_at) === parseInt(timeStamp)
          }).text)
        })
      }
    })
  })
  //convert set to array and count total sentiment
  members.forEach((member) => {
    const firstID = member['user_id']
    popularPeople[firstID].messages = Array.from(popularPeople[firstID].messages)
    popularPeople[firstID].messages.forEach((message) => {
      popularPeople[firstID].totalSentiment += sentiment(message).score
    })
    popularPeople[firstID].sentMessages.forEach((message) => {
      popularPeople[firstID].internalSentiment += sentiment(message).score
    })
  })


  //find most popular person with correct name
  let max = -1
  let maxKey = ''
  let mostHated = 50
  let hatedKey = ''
  let mostLiked = -50
  let likedKey = ''
  let mostSad = 50
  let sadKey = ''
  let mostHappy = -50
  let happyKey = ''

  Object.keys(popularPeople).forEach((key) => {
    const curr = popularPeople[key].count
    if (max < curr) {
      max = curr
      maxKey = key
    }
    let currSentiment = popularPeople[key].totalSentiment
    if (mostHated > currSentiment) {
      mostHated = currSentiment
      hatedKey = key
    }
    if (mostLiked < currSentiment) {
      mostLiked = currSentiment
      likedKey = key
    }
    currSentiment = popularPeople[key].internalSentiment
    if (mostSad > currSentiment) {
      mostSad = currSentiment
      sadKey = key
    }
    if (mostHappy < currSentiment) {
      mostHappy = currSentiment
      happyKey = key
    }
  })
  return {
    popular: {
      user_id: maxKey,
      name: members.find((member) => member.user_id === maxKey).nickname,
      messages: popularPeople[maxKey].messages,
      img: members.find((member) => member.user_id === maxKey).image_url,
    },
    hated: {
      user_id: hatedKey,
      name: members.find((member) => member.user_id === hatedKey).nickname,
      messages: popularPeople[hatedKey].messages,
      img: members.find((member) => member.user_id === hatedKey).image_url,
    },
    liked : {
      user_id: likedKey,
      name: members.find((member) => member.user_id === likedKey).nickname,
      messages: popularPeople[likedKey].messages,
      img: members.find((member) => member.user_id === likedKey).image_url,
    },
    sad: {
      user_id: sadKey,
      name: members.find((member) => member.user_id === sadKey).nickname,
      messages: popularPeople[sadKey].messages,
      img: members.find((member) => member.user_id === sadKey).image_url
    },
    happy: {
      user_id: happyKey,
      name: members.find((member) => member.user_id === happyKey).nickname,
      messages: popularPeople[happyKey].messages,
      img: members.find((member) => member.user_id === happyKey).image_url,
    }
  }

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
      }
    })
  })
  return frequentConvos
}

function logFrequentChats(firstChat, secondChat) {
  let count = 0
  let messageTimeStamps = []
  let selfTimeStamps = []
  if (!firstChat || !secondChat) {
    return {messageTimeStamps, selfTimeStamps, count}
  }
  let i = firstChat.length - 1
  let j = secondChat.length - 1
  while (j > 0 && i > 0) {
    let diff = firstChat[i] - secondChat[j]
    if (Math.abs(diff) < 60 * 3) {
      ++count
      selfTimeStamps.push(firstChat[i])
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
  return {messageTimeStamps, selfTimeStamps, count}
}
