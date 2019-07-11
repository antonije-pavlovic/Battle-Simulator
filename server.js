const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const routes = require('./routes/routes')

const app = express()
const PORT = 4000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

routes(app)
mongoose.connect('mongodb://localhost/battle', { useNewUrlParser: true })
  .then(() => {
    console.log('connected to database')
  })
  .catch((err) => {
    console.log(err)
  })

app.listen(PORT, () => {
  console.log('server is running')
})
