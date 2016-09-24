const express = require('express')

const app = express()
const portNum = process.env.PORT || 8080

app.use('/', (req, res) => {
  res.send('hello world')
})

app.listen(portNum, () => {
  if (!process.env.PORT) {
    console.log('Serving port number ' + portNum)
  }
})
