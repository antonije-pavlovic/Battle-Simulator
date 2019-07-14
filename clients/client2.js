const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const { strategy } = require('../helpers/clientStrategy')
const { delayFun } = require('../helpers/delayHelper')

const app = express()
const PORT = 3002
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
let armies = []
let token = ''

const army = {
  name: 'Tor',
  numOfSquads: 95,
  webHook: 'http://localhost:3002'
}

app.post('/join', (req, res) => {
  console.log(`Tor join`)
  res.status(200).send(token)
  armies = req.body.data
})

app.post('/update', (req, res) => {
  console.log(`Tor update`)
  res.status(200).send(token)
  console.log(`you have been attacked: armyId: ${req.body.armyId}, squadsCount: ${req.body.squadsCount}, rankRate: ${req.body.rankRate}`)
})

app.post('/leave', (req, res) => {
  console.log('Tor leave')
  // eslint-disable-next-line prefer-destructuring
  token = req.body.token
  res.sendStatus(200)
  armies = req.body.data
})

setTimeout(async () => {
  const id = strategy(armies, 'weakest')
  console.log(`Tor chose ${id} to attack`)
  try {
    (async function loop (i) {
      if (i >= army.numOfSquads) {
        return false
      }
      await delayFun(Math.floor(army.numOfSquads / 10))
      request.put(`http://localhost:3000/api/attack/${id}/${token}`, (error, response, body) => {
        if (!error) {
          body = JSON.parse(body)
          if (body.success) {
            console.log(body)
            return false
          }
          console.log(body)
          i += 1
          return loop(i)
        }
        return loop(i)
      })
    })(0)
  } catch (e) {
    console.log(e)
  }
}, 11000)

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
}, 4500)

app.listen(PORT, () => {
  console.log(`TOR is listening on port: ${PORT}`)
})
