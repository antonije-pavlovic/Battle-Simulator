const TokenService = require('../services/tokenService')
const config = require('../env')
const WebHook = require('../helpers/webHooks')
const Army = require('../domain/army')
const ArmyRepository = require('../repository/armyRepository')
const BattleService = require('../services/battleService')

class BattleRepository {
  static leave (token) {
    TokenService.decodeToken(token, config.secret)
      .then(async (data) => {
        let type
        // eslint-disable-next-line no-underscore-dangle
        const army = await Army.findOne({ _id: data.armyId })
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

  static attack (repeats, token) {
    return new Promise((resolve, reject) => {
      TokenService.decodeToken(token, config.secret)
        .then(async (data) => {
          const army = await ArmyRepository.getArmyById(data.armyId)
          console.log('-------atack method')
          const chances = BattleService.chances(army.squads)
          const probability = BattleService.probability(chances)
          if (probability) {
            const attackDemage = BattleService.attackDamage(repeats, army.squads)
            const recivedDamage = BattleService.recivedDemaga(army.squads)
            resolve({
              attackDemage,
              recivedDamage
            })
          }
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({ attack: 'attack unsucessufull', recivedDemage: '0' })
        }).catch((err) => {
          console.log(err)
        })
    })
  }
}
module.exports = BattleRepository
