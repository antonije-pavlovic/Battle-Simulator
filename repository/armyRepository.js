const Army = require('../domain/army')

class ArmyRepository {
  static register (name, numOfSquads, webHook) {
    const army = new Army({
      name,
      numOfSquads,
      webHook,
      alive: true
    })
    army.save()
  }
}
module.exports = ArmyRepository
