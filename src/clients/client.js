const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const { fork } = require('child_process')
const { strategy } = require('../helpers/clientStrategy')
const { delayFun } = require('../helpers/delayHelper')
const { popMeOut } = require('../helpers/popMeOut')


function run(
  {
    name,
    numOfSquads,
    port,
    attackStrategy,
  },
) {
  const app = express()
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  let armies = []
  let token = ''
  const webHook = `${process.env.CLIENT_HOST}:${port}`
  app.post('/join', (req, res) => {
    res.status(200).send(token)
    console.log(`ovo je ${name} dobio`)
    console.log(req.body.armies)
    armies = popMeOut(req.body.armies, name)
  })

  app.post('/update', (req, res) => {
    res.status(200).send(token)
    console.log(`you have been attacked: armyId: ${req.body.armyId}, squadsCount: ${req.body.squadsCount}, rankRate: ${req.body.rankRate}`)
  })

  app.post('/leave', (req, res) => {
    // eslint-disable-next-line prefer-destructuring
    token = req.body.token
    res.sendStatus(200).send(token)
    armies = popMeOut(req.body.data, name)
  })

  setTimeout(async () => {
    const id = strategy(armies, attackStrategy)
    console.log(`${name} chose ${id} to attack`)
    try {
      (async function loop (i) {
        if (i >= numOfSquads) {
          return false
        }
        // await delayFun(Math.floor(army.numOfSquads / 10))
        request.put(`http://localhost:3000/api/attack/${id}/${token}`, (error, response, body) => {
          if (!error) {
            console.log('ovo je bodyyyyyyyyyyyyyyyyyy')
            console.log(body)
            body = JSON.parse(body)
            if (body.msg) {
              console.log(body)
              return false
            }
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
  }, 9000)

  setTimeout(() => {
    request.post(
      'http://localhost:3000/api/join',
      { json: { name, numOfSquads, webHook } }, (error, response, body) => {
        if (!error) {
          // eslint-disable-next-line prefer-destructuring
          token = body.token
          console.log(token)
        }
      },
    )
  }, 2500)

  app.listen(port, () => {
    console.log(`${name} is listening on port: ${port}`)
  })
}

process.on('message', run)
