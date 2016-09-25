const express = require('express')
const api = require('./api.js')
const nlp = require('./nlp.js')
const nlp2 = require('./nlp2.js')
const moment = require('moment')

const app = express()
const portNum = process.env.PORT || 8080

app.use(express.static(__dirname + '/../client'))

app.get('/data', (req, res) => {
  api.getMembers().then((members) => {
    api.getMessages().then((messages) => {
      res.send({
        lovers: nlp.findLovers(messages, members),
        participants: nlp.measureParticipants(messages, members),
        extremeTimePeople: nlp2.extremeTimePeople(messages),
        density: nlp.plotDensity(messages),
      })
    })
  })
})

app.listen(portNum, () => {
  if (!process.env.PORT) {
    console.log('Serving port number ' + portNum)
  }
})
