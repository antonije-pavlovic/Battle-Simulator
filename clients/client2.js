const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const strategy = require('../helpers/clientStrategy')
const delayFun = require('../helpers/delayHelper')

const app = express()
const PORT = 3008
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
let armies = []
let token = ''

const army = {
  name: 'army 2',
  numOfSquads: 120,
  webHook: 'http://localhost:3008'
}

app.post('/join', (req, res) => {
  console.log('client 2 join')
  console.log(req.body)
  res.sendStatus(200) //  mora api da saceka 200
  armies.push(req.body)
})

app.post('/leave', (req, res) => {
  console.log('client 2 leave')
  // eslint-disable-next-line prefer-destructuring
  token = req.body.token
  res.sendStatus(200) //  mora api da saceka 200
  armies = req.body.data
  console.log(armies)
})

setTimeout(async () => {
  console.log('client 2 attack');
  // console.log(armies)
  const id = strategy(armies, 'strongest')
  for (let i = 0; i < army.numOfSquads; i + 1) {
    // eslint-disable-next-line no-await-in-loop
    try {
      // eslint-disable-next-line no-await-in-loop
      await delayFun(Math.floor(army.numOfSquads / 10))
      request.put(
        `http://localhost:4000/api/attack/${id}/${token}`, (error, response, body) => {
          if (error) {
            console.log(error)
          }
        }
      )
    } catch (e) {
      console.log(e)
    }
  }
}, 9000)

setTimeout(() => {
  request.post(
    'http://localhost:4000/api/join',
    { json: army }, (error, response, body) => {
      if (!error) {
        console.log(body)
      }
    }
  )
}, 3000)

app.listen(PORT, () => {
  console.log('CLIENT 2')
})
