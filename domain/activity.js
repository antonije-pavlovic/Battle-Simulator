const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema({
  army1: String,
  action: String,
  army2: String
})
module.exports = mongoose.model('Activity', activitySchema)
