const Army = require('../domain/army')
const TokenService = require('../services/tokenService')
const config = require('../env')

class ArmyRepository {
  static register (name, numOfSquads, webHook) {
    const army = new Army({
      name,
      numOfSquads,
      webHook,
      alive: true
    })
    army.save()
    return TokenService.getToken({ name, webHook }, config.secret, { tokenLife: config.tokenLife })
  }
}
module.exports = ArmyRepository
