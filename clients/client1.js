const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const strategy = require('../helpers/clientStrategy')

const app = express()
const PORT = 3005
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const armies = []
let token = ''

app.post('/join', (req, res) => {
  res.sendStatus(200) //  mora api da saceka 200
  armies.push(req.body.data)
})

setTimeout(() => {
  request.post(
    'http://localhost:4000/api/join',
    { json: { name: 'army 1', numOfSquads: 150, webHook: 'http://localhost:3005' } }, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        console.log(body)
      }
    }
  )
}, 3000)

app.listen(PORT, () => {
  console.log('CLIENT 1')
})
