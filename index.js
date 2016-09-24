const express = require('express')
const api = require('./api.js')

const app = express()
const portNum = process.env.PORT || 8080

app.use('/', (req, res) => {
  api.getMembers().then((members) => {
    res.send(members)
  })
})

app.listen(portNum, () => {
  if (!process.env.PORT) {
    console.log('Serving port number ' + portNum)
  }
})
