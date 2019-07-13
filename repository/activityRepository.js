const Activity = require('../domain/activity')

class ActivityRepository {
  static battleActivity (army1, action, army2) {
    const activity = new Activity({
      army1,
      action,
      army2
    })
    activity.save()
  }

  static siteActivity (army1, action) {
    const activity = new Activity({
      army1,
      action
    })
    activity.save()
  }
}
module.exports = ActivityRepository
