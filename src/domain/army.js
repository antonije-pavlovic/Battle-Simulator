const mongoose = require('mongoose')

const armySchema = new mongoose.Schema({
  name: String,
  squads: Number,
  webHook: String,
  active: Boolean
})
module.exports = mongoose.model('Army', armySchema)
