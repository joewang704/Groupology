'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const api = require('./api.js')
const nlp = require('./nlp.js')
const nlp2 = require('./nlp2.js')
const moment = require('moment')

const app = express()
const portNum = process.env.PORT || 8080
const oauthRedirectUrl = 'https://oauth.groupme.com/oauth/authorize?client_id=uxVzcYmmBXf1m7PYV5STjIC6CcCstX3haxx9hyZOcCJ3MStp'

let token
let groupId

app.set('view engine', 'html')

app.use('/static', express.static(__dirname + '/../client'))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  //res.sendFile('client/entry.html', { root: '../' })
  res.redirect('/static/entry.html')
})

app.get('/verify', (req, res) => {
  token = req.query.access_token
  res.sendFile('client/groups.html', { root: '../' })
})

app.get('/data', (req, res) => {
  console.log(token)
  api.getMembers(token, groupId).then((members) => {
    api.getMessages(token, groupId).then((messages) => {
      res.send({
        lovers: nlp.findLovers(messages, members),
        participants: nlp.measureParticipants(messages, members),
        extremeTimePeople: nlp2.extremeTimePeople(messages),
        density: nlp.plotDensity(messages),
        popularPeople: nlp.findMostPopular(messages, members),
      })
    })
  })
})

app.get('/groups', (req, res) => {
  api.getGroups(token).then((groups) => {
    res.send(groups)
  })
})

app.post('/groups', (req, res) => {
  groupId = req.body.groupId
  res.send({
    auth: true
  })
})

app.listen(portNum, () => {
  if (!process.env.PORT) {
    console.log('Serving port number ' + portNum)
  }
})
