const express = require('express')
const api = require('./api.js')
const nlp = require('./nlp.js')
const nlp2 = require('./nlp2.js')

const app = express()
const portNum = process.env.PORT || 8080

app.use('/', (req, res) => {
  api.getMembers().then((members) => {
    api.getMessages().then((messages) => {
      res.send(nlp.findMostPopular(messages, members))
    })
  })
})

app.listen(portNum, () => {
  if (!process.env.PORT) {
    console.log('Serving port number ' + portNum)
  }
})
