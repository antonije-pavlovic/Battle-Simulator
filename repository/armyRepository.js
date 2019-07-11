const Army = require('../domain/army')
const TokenService = require('../services/tokenService')
const config = require('../env')

class ArmyRepository {
  static register (name, numOfSquads, webHook) {
    const army = new Army({
      name,
      numOfSquads,
      webHook
    })
    army.save()
    const armyId = army._id
    // ovde webhook army.join type == new
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
        console.log(data)
        // webhook army.join type == returned
        return callback(data)
      }).catch(() => {
        return callback()
      })
  }
}
module.exports = ArmyRepository
