const express = require('express')
const mongoose = require('mongoose')
const routes = require('./routes/routes')

const app = express()
const PORT = 3000

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
