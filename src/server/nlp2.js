const pos = require('pos')
const moment = require('moment')

exports.extremeTimePeople = (messages) => {
  const returnObj = {
    nightOwl: {
      count: -1,
    },
    earlyBird: {
      count: -1,
    },
  }
  const nightMembers = {}
  const dayMembers = {}
  messages.forEach((message) => {
    const currTime = moment.unix(message.created_at)
    console.log(currTime.format('MMMM Do YYYY, h:mm:ss a'))
    if (currTime.isBetween(moment(currTime).set('hour', 4), moment(currTime).set('hour', 10))) {
      let curr = dayMembers[message.user_id]
      dayMembers[message.user_id] = curr === undefined || curr === null ? 0 : curr + 1
      if (curr + 1 > returnObj.earlyBird.count) {
        console.log("is early bird")
        returnObj.earlyBird.count = curr + 1
        returnObj.earlyBird.user_id = message.user_id
        returnObj.earlyBird.name = message.name
      }
    } else if (currTime.isBetween(moment(currTime).set('hour', 22), moment(currTime).set('hour', 24))
      || currTime.isBetween(moment(currTime).set('hour', 0), moment(currTime).set('hour', 4))) {
      console.log("is night owl")
      let curr = nightMembers[message.user_id]
      nightMembers[message.user_id] = curr === undefined || curr === null ? 0 : curr + 1
      if (curr + 1 > returnObj.nightOwl.count) {
        returnObj.nightOwl.count = curr + 1
        returnObj.nightOwl.user_id = message.user_id
        returnObj.nightOwl.name = message.name
      }
    }
  })
  return returnObj
}

exports.mostPopularWord = (messages) => {
  const tagger = new pos.Tagger()
  const msgCount = {}
  const maxObj = {
    count: 0,
    word: '',
  }
  messages.forEach((message) => {
    if (message.text) {
      const words = new pos.Lexer().lex(message.text)
      tagger.tag(words).forEach((wordArr) => {
        const word = wordArr[0]
        const tag = wordArr[1]
        if (['CC', 'DT', 'EX', 'RP'].indexOf(tag) === -1 && word.length > 1) {
          //console.log(wordArr)
          if (word != "") {
            let curr = msgCount[word]
            msgCount[word] =
              curr === undefined || curr === null ? 1 : ++curr
            if (curr > maxObj.count) {
              maxObj.count = curr
              maxObj.word = word
            }
          }
        }
      })
    }
  })
  //console.log(msgCount)
  return msgCount
}

