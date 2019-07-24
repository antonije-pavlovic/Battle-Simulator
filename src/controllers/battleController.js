const { leaveBattle, attack } = require('../services/armyService')

const counters = {}

exports.attack = async (obj) => {
  const { token, armyId } = obj
  if (!token) {
    throw new Error('Token isnt provided')
  }
  counters[token] += 1
  const battleStatistic = await attack(counters[token], token, armyId)
  console.log(battleStatistic)
  return battleStatistic
}

exports.leave = (req, res) => {
  leaveBattle(req.params.token)
}

exports.repeatHelper = (req, res, next) => {
  const { token } = req.params
  if (token in counters) {
    next()
  } else {
    counters[token] = 0
    next()
  }
}
