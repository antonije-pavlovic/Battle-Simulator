const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const strategy = require('../helpers/clientStrategy')

const app = express()
const PORT = 3006
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const armies = []
let token = ''

app.post('/join', (req, res) => {
  console.log('clieant 2')
  console.log(req.body)
  res.sendStatus(200) //  mora api da saceka 200
  armies.push(req.body.data)
})

setTimeout(() => {
  request.post(
    'http://localhost:4000/api/join',
    { json: { name: 'army 2', numOfSquads: 250, webHook: 'http://localhost:3006' } }, (error, response, body) => {
      if (!error) {
        console.log(body)
      }
    }
  )
}, 4000)

app.listen(PORT, () => {
  console.log('CLIENT 1')
})
