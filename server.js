require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { fork } = require('child_process')
const routes = require('./src/routes/routes')
const players = require('./src/players')

const app = express()
const PORT = process.env.SERVER_PORT

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

routes(app);
(async () => {
  try {
    await mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true })
    app.listen(PORT, () => {
      console.log('server is running')
    })
    players.map(player => fork('src/clients/client.js').send(player))
  } catch (e) {
    process.exit(1)
  }
})()
