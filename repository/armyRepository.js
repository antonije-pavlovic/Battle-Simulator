const Army = require('../domain/army')
const { getToken, decodeToken } = require('../services/tokenService')
const config = require('../env')
const { join, leave, update } = require('../helpers/webHooks')
const { siteActivity, battleActivity } = require('./activityRepository')
const { rankRate } = require('../helpers/calculateRank')
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
    const armies = getAlive()
    join(army, armies, 'new')
    siteActivity(name, 'registered')
    const armyId = army._id
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
    .then(async (data) => {
      // console.log(data)
      const army = await Army.findOne({ _id: data.armyId })
      army.active = true
      siteActivity(data.name, 'returned')
      join(data, getAlive(), 'returned')
      return callback(data)
    })
    .catch(() => callback())
}

async function getAlive () {
  return Army.find({ squads: { $gt: 0 }, active: true })
}

function getArmyById (id) {
  return Army.findById(id)
}
function leaveBattle (token) {
  decodeToken(token, config.secret)
    .then(async (data) => {
      let type
      // eslint-disable-next-line no-underscore-dangle
      const army = await Army.findOne({ _id: data.armyId })
      army.active = false
      army.save()
        .then(() => {
          siteActivity(data.name, 'leave')
          // eslint-disable-next-line no-underscore-dangle
          leave(army._id, getAlive(), type)
        })
    }).catch((err) => {
      console.log(err)
    })
}

async function attack (repeats, token, armyId) {
  return decodeToken(token, config.secret)
    .then(async (data) => {
      const army = await getArmyById(data.armyId)
      const attackedArmy = await getArmyById(armyId)
      const chance = chances(army.squads)
      const prob = probability(chance)
      if (prob) {
        const attackDemage = attackDamage(repeats, army.squads)
        const recivedDamage = recivedDemage(attackedArmy.squads)
        attackedArmy.squads -= attackDemage
        army.squads -= recivedDamage
        attackedArmy.save()
        army.save()
        if (army.squads <= 0) {
          await armyDead(army._id)
        }
        if (attackedArmy.squads <= 0) {
          await armyDead(attackedArmy._id)
        }
        const rank = await rankRate(attackedArmy._id, await getOrderedArmies())
        update([attackedArmy], { squadsCount: attackedArmy.squads, rank })
        return {
          attackDemage,
          recivedDamage,
          success: true
        }
      }
      // eslint-disable-next-line prefer-promise-reject-errors
      return { attack: 'attack unsucessufull', recivedDemage: '0', success: false }
    }).catch((err) => {
      console.log(err)
    })
}

async function armyDead (id) {
  const army = await Army.findOne(id)
  army.active = false
  army.save()
    .then(() => {
      siteActivity(army.name, 'dead')
      // eslint-disable-next-line no-underscore-dangle
      leave(army._id, getAlive(), 'dead')
    })
}

function getOrderedArmies () {
  return Army.find({ squads: { $gt: 0 }, active: true }).sort({ squads: 'desc' })
    .then(data => data)
}

module.exports = {
  register,
  joinArmy,
  attack,
  leaveBattle
}
