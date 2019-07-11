const Army = require('../domain/army')
const TokenService = require('../services/tokenService')
const config = require('../env')
const WebHook = require('../helpers/webHooks')

class ArmyRepository {
  static register (name, squads, webHook) {
    const army = new Army({
      name,
      squads,
      webHook
    })
    army.save()
    const armyId = army._id
    WebHook.join(army, ArmyRepository.getAlive(), 'new')
    return TokenService.getToken(
      { armyId, name, webHook },
      config.secret,
      {
        tokenLife: config.tokenLife
      }
    )
  }

  static join (token, callback) {
    TokenService.decodeToken(token, config.secret)
      .then((data) => {
        // console.log(data)
        WebHook.join(data, ArmyRepository.getAlive(), 'returned')
        return callback(data)
      }).catch(() => {
        return callback()
      })
  }

  static getAlive () {
    return Army.find({ squads: { $gt: 0 } })
  }
}
module.exports = ArmyRepository
