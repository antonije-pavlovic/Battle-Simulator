const Army = require('../domain/army')
const { getToken, decodeToken } = require('../services/tokenService')
const config = require('../env')
const { join, leave } = require('../helpers/webHooks')
const { siteActivity } = require('./activityRepository')
const {
  chances,
  probability,
  attackDamage,
  recivedDemage
} = require('../services/battleService')

function register (name, squads, webHook) {
  return new Promise((resolve, reject) => {
    const army = new Army({
      name,
      squads,
      webHook,
      active: true
    })
    army.save()
    siteActivity(name, 'registered')
    const armyId = army._id
    const armies = getAlive()
    join(army, armies, 'new')
    getToken(
      { armyId, name, webHook },
      config.secret,
      {
        tokenLife: config.tokenLife
      }
    ).then(token => resolve(token))
  })
}

function joinArmy (token, callback) {
  decodeToken(token, config.secret)
    .then((data) => {
      // console.log(data)
      siteActivity(data.name, 'returned')
      join(data, getAlive(), 'returned')
      return callback(data)
    })
    .catch(() => callback())
}

async function getAlive () {
  return Army.find({ squads: { $gt: 0 }, active: true })
  // ubaci da i razlicito od armyid da ne stize samom sebi poruka
}

function getArmyById (id) {
  return Army.findById(id)
    .then(data => data)
    .catch(err => err)
}
function leaveArmy (token) {
  decodeToken(token, config.secret)
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
          siteActivity(data.name, type)
          // eslint-disable-next-line no-underscore-dangle
          leave(army._id, getAlive(), type)
        })
    }).catch((err) => {
      console.log(err)
    })
}

function attack (repeats, token) {
  return decodeToken(token, config.secret)
    .then(async (data) => {
      const army = await getArmyById(data.armyId)
      console.log('-------atack method')
      const chance = chances(army.squads)
      const prob = probability(chance)
      if (prob) {
        const attackDemage = attackDamage(repeats, army.squads)
        const recivedDamage = recivedDemage(army.squads)
        return {
          attackDemage,
          recivedDamage
        }
      }
      // eslint-disable-next-line prefer-promise-reject-errors
      throw new Error()
    }).catch((err) => {
      console.log(err)
      return { attack: 'attack unsucessufull', recivedDemage: '0' }
    })
}

module.exports = {
  register,
  joinArmy,
  attack,
  leaveArmy
}
