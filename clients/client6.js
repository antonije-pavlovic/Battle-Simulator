const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()
const PORT = 3006
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
let armies = []
let token = ''

const army = {
  name: 'Deadpool',
  numOfSquads: 70,
  webHook: 'http://localhost:3006'
}

app.post('/join', (req, res) => {
  console.log(`Deadpool join`)
  res.status(200).send(token)
  armies = req.body.data
})

app.post('/update', (req, res) => {
  console.log(`Deadpool update`)
  res.status(200).send(token)
  console.log(`you have been attacked: armyId: ${req.body.armyId}, squadsCount: ${req.body.squadsCount}, rankRate: ${req.body.rankRate}`)
})

app.post('/leave', (req, res) => {
  console.log('Deadpool leave')
  // eslint-disable-next-line prefer-destructuring
  token = req.body.token
  res.sendStatus(200)
  armies = req.body.data
})

setTimeout(() => {
  request.post(
    'http://localhost:3000/api/join',
    { json: army }, (error, response, body) => {
      if (!error) {
        // eslint-disable-next-line prefer-destructuring
        token = body.token
      }
    }
  )
}, 8500)

app.listen(PORT, () => {
  console.log(`Deadpool is just watching :D`)
})
