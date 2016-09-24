const express = require('express')
const api = require('./api.js')
const nlp = require('./nlp.js')

const app = express()
const portNum = process.env.PORT || 8080

app.use('/', (req, res) => {
  api.getMembers().then((members) => {
    api.getMessages().then((messages) => {
      //res.send(nlp.measureParticipants(messages, members))
      res.send(nlp.findLovers(messages, members))
    })
  })
})

app.listen(portNum, () => {
  if (!process.env.PORT) {
    console.log('Serving port number ' + portNum)
  }
})
