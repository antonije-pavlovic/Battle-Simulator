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

/**
 * when army hit join route without token this function is called
 * it insert new army in database, then get all alive armies
 * and trigger the join webhook and send them joined army
 * and return token
 * and  record th activity
 */
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

/**
 * if army was left the battle and want to come back this functions is called
 * verify token, get all allive armies
 * and trigger join webhook to notify them that army had returned
 */
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

/**
 * if army want to leave this function is called
 * verify token, then set army active property to false
 * so army cannot be chosen with getAlive() function
 */
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

/**
 *this function is called when army attack another army
 * first check if any army is already defeated
 * then calculate chances of successful attack based on squads number
 * then only if probability is true army can damage attacked army
 * if attack was successful i trigger update webhook to notify attackedArmy
 * also if any army remains without squads i call deadArmy function
 * and record the activity
 */
async function attack(repeats, token, armyId) {
  try {
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
      return {
        attackDemage,
        recivedDamage,
        success: true,
      }
    }
    return { attack: 'attack unsucessufull', recivedDemage: '0', success: false }
  } catch (e) {
    console.log(e)
    throw e
  }
}

/**
 * called when army is defeated - I suppose that army is dead if it has less then 0 squads
 * first i get dead army and set it active property to false
 * record the activity and trigger the leave webhook to notify others armies that this army is dead
 */
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
