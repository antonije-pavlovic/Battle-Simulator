const Army = require('../domain/army')
const TokenService = require('../services/tokenService')
const config = require('../env')
const WebHook = require('../helpers/webHooks')

class ArmyRepository {
  static async register (name, squads, webHook) {
    return new Promise((resolve, reject) => {
      const army = new Army({
        name,
        squads,
        webHook,
        active: true
      })
      army.save()
      const armyId = army._id
      const armies = ArmyRepository.getAlive()
      WebHook.join(army, armies, 'new')
      TokenService.getToken(
        { armyId, name, webHook },
        config.secret,
        {
          tokenLife: config.tokenLife
        }
      ).then(token => resolve(token))
    })
  }

  static join (token, callback) {
    TokenService.decodeToken(token, config.secret)
      .then((data) => {
        // console.log(data)
        WebHook.join(data, ArmyRepository.getAlive(), 'returned')
        return callback(data)
      })
      .catch(() => callback())
  }

  static async getAlive () {
    return Army.find({ squads: { $gt: 0 }, active: true })
    // ubaci da i razlicito od armyid d ne stize samom sebi poruka
  }

  static getArmyById (id) {
    return new Promise((resolve, reject) => {
      Army.findById(id)
        .then(data => resolve(data))
    })
  }
}
module.exports = ArmyRepository
