const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const { strategy } = require('../helpers/clientStrategy')
const { delayFun } = require('../helpers/delayHelper')

const app = express()
const PORT = 3007
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
let armies = []
let token = ''

const army = {
  name: 'army 1',
  numOfSquads: 100,
  webHook: 'http://localhost:3007'
}

app.post('/join', (req, res) => {
  console.log('client 1 join --------------')
  res.status(200).send(token) //  mora api da saceka 200
  armies.push(req.body.army)
})

app.post('/leave', (req, res) => {
  console.log('client 1 leave')
  // eslint-disable-next-line prefer-destructuring
  token = req.body.token
  res.sendStatus(200) //  mora api da saceka 200
  armies = req.body.data
})

setTimeout(async () => {
  console.log('client 1 attack')
  const id = strategy(armies, 'strongest')
  console.log(`choosen army ${id}`)
  try {
    // for (let i = 0; i < army.numOfSquads; i + 1) {
    (async function loop (i) {
      if (i >= army.numOfSquads) {
        return false
      }
      await delayFun(Math.floor(army.numOfSquads / 10))
      request.put(`http://localhost:4000/api/attack/${id}/${token}`, (error, response, body) => {
        if (!error) {
          if (response.statusCode === 200) {
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
}, 6000)

setTimeout(() => {
  request.post(
    'http://localhost:4000/api/join',
    { json: army }, (error, response, body) => {
      if (!error) {
        token = body.token
        console.log(body)
      }
    }
  )
}, 4500)

app.listen(PORT, () => {
  console.log('CLIENT 1')
})
