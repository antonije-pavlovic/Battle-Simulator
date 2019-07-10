const mongoose = require('mongoose')

const Schema = mongoose.schema
const armySchema = new Schema({
  name: String,
  squads: Number,
  webHook: String
})
module.exports = armySchema
