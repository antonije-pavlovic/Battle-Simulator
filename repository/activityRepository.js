const Activity = require('../domain/activity')

function battleActivity (army1, action, army2) {
  const activity = new Activity({
    army1,
    action,
    army2
  })
  activity.save()
}

function siteActivity (army1, action) {
  const activity = new Activity({
    army1,
    action
  })
  activity.save()
}
module.exports = { battleActivity, siteActivity }
