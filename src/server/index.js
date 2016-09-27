'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const api = require('./api.js')
const nlp = require('./nlp.js')
const moment = require('moment')

const app = express()
const portNum = process.env.PORT || 8069
const clientId = 'Gb8DfWXvG4KDMz8NywlRyVXOmXMmEN6pzolJNexOP4dh0klg'
const oauthRedirectUrl = 'https://oauth.groupme.com/oauth/authorize?client_id=' + clientId

app.set('views', __dirname + '/../client/views')
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'ejs');

app.use('/static', express.static(__dirname + '/../client'))
app.use(bodyParser.json())
app.use(cookieParser())

app.get('/', (req, res) => {
  res.render('entry')
})

app.get('/verify', (req, res) => {
  const token = req.query.access_token
  res.cookie('token', token)
  api.getGroups(token).then((groups) => {
    res.render('groups', { groups })
  })
})

app.get('/data', (req, res) => {
  const token = req.cookies.token
  const groupId = req.cookies.groupId
  api.getMembers(token, groupId).then((members) => {
    api.getMessages(token, groupId).then((messages) => {
      res.send({
        lovers: nlp.findLovers(messages, members),
        participants: nlp.measureParticipants(messages, members),
        extremeTimePeople: nlp.extremeTimePeople(messages),
        density: nlp.plotDensity(messages),
        favorited: nlp.mostFavorited(messages),
        popularPeople: nlp.findMostPopular(messages, members),
      })
    })
  })
})

app.get('/groups', (req, res) => {
  const token = req.cookies.token
  api.getGroups(token).then((groups) => {
    res.send(groups)
  })
})

app.post('/groups', (req, res) => {
  res.cookie('groupId', req.body.groupId)
  res.send({
    auth: true
  })
})

app.listen(portNum, () => {
  if (!process.env.PORT) {
    console.log('Serving port number ' + portNum)
  }
})
