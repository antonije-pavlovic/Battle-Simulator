const BattleRepository = require('../repository/BattleRepository')

const counters = {}
exports.attack = (req, res) => {
  const { token } = req.params
  if (!token) {
    return res.sendStatus(401).json('Token isnt provided')
  }
  counters[token] += 1
  const battleStatistic = BattleRepository.attack(counters[token], req.params.token)
  return res.sendStatus(200).json(battleStatistic)
}
exports.leave = (req, res) => {
  BattleRepository.leave(req.params.token)
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