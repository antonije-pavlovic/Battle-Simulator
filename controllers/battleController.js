const { leaveArmy, attack } = require('../repository/armyRepository')

const counters = {}

exports.attack = (req, res) => {
  const { token } = req.params
  if (!token) {
    return res.sendStatus(401).json('Token isnt provided')
  }
  console.log('battle controller attack')
  counters[token] += 1
  attack(counters[token], token)
    .then(battleStatistic => res.status(200).send(battleStatistic))
    .catch(battleStatistic => res.status(201).send(battleStatistic))
}

exports.leave = (req, res) => {
  leaveArmy(req.params.token)
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
