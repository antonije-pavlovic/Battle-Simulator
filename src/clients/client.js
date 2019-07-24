const express = require('express')
const bodyParser = require('body-parser')
const { strategy } = require('../helpers/clientStrategy')
const { popMeOut } = require('../helpers/popMeOut')
const { Request } = require('../helpers/request')

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
    armies = popMeOut(req.body.armies, name)
  })

  app.post('/update', (req, res) => {
    res.status(200).send(token)
    const { armyId, squadsCount, rankRate } = req.body
    console.log(`you have been attacked: armyId: ${armyId}, squadsCount: ${squadsCount}, rankRate: ${rankRate}`)
  })

  app.post('/leave', (req, res) => {
    // eslint-disable-next-line no-shadow
    const { token, data } = req.body
    res.sendStatus(200).send(token)
    armies = popMeOut(data, name)
  })

  setTimeout(async () => {
    const id = strategy(armies, attackStrategy)
    console.log(`${name} chose ${id} to attack`)
    try {
      for (let i = 0; i < numOfSquads; i += 1) {
        try {
          // eslint-disable-next-line no-await-in-loop
          const response = await Request('put', `http://localhost:3000/api/attack/${id}/${token}`)
          const body = JSON.parse(response.body)
          if (body.success) {
            console.log(body)
            break
          }
          if (body.msg) {
            console.log(body)
            break
          }
        } catch (e) {
          console.log(e)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }, 3000)

  setTimeout(async () => {
    try {
      const response = await Request('post', 'http://localhost:3000/api/join', { name, numOfSquads, webHook })
      token = JSON.parse(response.body).token
    } catch (e) {
      console.log(e)
    }
  }, 2000)

  app.listen(port, () => {
    console.log(`${name} is listening on port: ${port}`)
  })
}

process.on('message', run)
