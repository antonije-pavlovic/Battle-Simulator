const TokenService = require('../services/tokenService')
const config = require('../env')
const WebHook = require('../helpers/webHooks')
const Army = require('../domain/army')
const ArmyRepository = require('../repository/armyRepository')

class BattleRepository {
  static leave (token) {
    TokenService.decodeToken(token, config.secret)
      .then(async (data) => {
        let type
        // eslint-disable-next-line no-underscore-dangle
        let army = await Army.findOne({ _id: data.armyId })
        army.active = false
        console.log(army)
        army.save()
          .then(() => {
            if (army.squads > 0) {
              type = 'leave'
            } else {
              type = 'dead'
            }
            // eslint-disable-next-line no-underscore-dangle
            WebHook.leave(army._id, ArmyRepository.getAlive(), type)
          })
      }).catch((err) => {
        console.log(err)
      })
  }
}
module.exports = BattleRepository
