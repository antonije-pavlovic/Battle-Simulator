const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')

const strategy = require('../helpers/clientStrategy')

const app = express()
const PORT = 3001
let army = 0
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/', (req, res) => {
  army = strategy(req.body.data, 'strongest')
  res.sendStatus(200) //  mora api da saceka 200
})

app.listen(PORT, () => {
  console.log('server is running')
})
