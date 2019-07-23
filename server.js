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

routes(app)
console.log(PORT)
mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to database')
  })
  .catch((err) => {
    server.close()
    console.log(err.message)
  })

const server = app.listen(PORT, () => {
  console.log('server is running')
})

players.map(player => fork('src/clients/client.js').send(player))
