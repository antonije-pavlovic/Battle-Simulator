const { join, leave, update } = require('../helpers/webHooks')
const { rankRate } = require('../helpers/calculateRank')
const { siteActivity, battleActivity } = require('../repository/activityRepository')
const { getToken, decodeToken } = require('../services/tokenService')
const {
  chances,
  probability,
  attackDamage,
  recivedDemage,
} = require('../services/battleService')
const {
  getAlive,
  getArmyById,
  getOrderedArmies,
  insertArmy,
} = require('../repository/armyRepository')

async function register(name, squads, webHook) {
  const army = await insertArmy(name, squads, webHook)
  const armies = await getAlive()
  await join(army, armies, 'new')
  siteActivity(name, 'registered')
  const armyId = army._id
  return getToken(
    { armyId, name, webHook },
    process.env.TOKEN_SECRET,
    {
      tokenLife: process.env.TOKEN_LIFE,
    },
  )
}

async function joinArmy(token, callback) {
  try {
    const data = await decodeToken(token, process.env.TOKEN_SECRET)
    const army = await getArmyById(data.armyId)
    army.active = true
    siteActivity(data.name, 'returned')
    const armies = await getAlive()
    await join(data, armies, 'returned')
    return callback(data)
  } catch (e) {
    console.log(e)
    return callback()
  }
}

async function leaveBattle(token) {
  try {
    const data = await decodeToken(token, process.env.TOKEN_SECRET)
    const army = await getArmyById(data.armyId)
    army.active = false
    await army.save()
    siteActivity(data.name, 'leave')
    const armies = await getAlive()
    await leave(army._id, armies, 'leave')
  } catch (e) {
    console.log(e)
  }
}

async function attack(repeats, token, armyId) {
  try {
    console.log('1')
    const data = await decodeToken(token, process.env.TOKEN_SECRET)
    const army = await getArmyById(data.armyId)
    const attackedArmy = await getArmyById(armyId)
    if (!army) {
      return {
        attack: 'attack unsucessufull',
        recivedDemage: '0',
        success: false,
        msg: 'you are defeated',
      }
    }
    console.log('2')
    if (!attackedArmy) {
      return {
        attack: 'attack unsucessufull',
        recivedDemage: '0',
        success: false,
        msg: 'Choosen army defeated',
      }
    }
    const chance = chances(army.squads)
    const prob = probability(chance)
    console.log('3')
    if (prob) {
      battleActivity(army.name, 'succeffuly attacked', attackedArmy.name)
      const attackDemage = attackDamage(repeats, army.squads)
      const recivedDamage = recivedDemage(attackedArmy.squads)
      attackedArmy.squads -= attackDemage
      army.squads -= recivedDamage
      await attackedArmy.save()
      await army.save()
      if (army.squads <= 0) {
        battleActivity(attackedArmy.name, 'killed', army.name)
        await armyDead(army._id)
      }
      if (attackedArmy.squads <= 0) {
        battleActivity(army.name, 'killed', attackedArmy.name)
        await armyDead(attackedArmy._id)
      }
      const orderedArmies = await getOrderedArmies()
      const rank = await rankRate(attackedArmy._id, orderedArmies)
      await update([attackedArmy], { squadsCount: attackedArmy.squads, rank })
      console.log('4')
      return {
        attackDemage,
        recivedDamage,
        success: true,
      }
    }
    console.log('5')
    return { attack: 'attack unsucessufull', recivedDemage: '0', success: false }
  } catch (e) {
    console.log(e)
    throw e
  }
}

async function armyDead(id) {
  try {
    const army = await getArmyById(id)
    army.active = false
    await army.save()
    siteActivity(army.name, 'dead')
    // eslint-disable-next-line no-underscore-dangle
    const armies = await getAlive()
    await leave(army._id, armies, 'dead')
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  register,
  joinArmy,
  attack,
  leaveBattle,
}
