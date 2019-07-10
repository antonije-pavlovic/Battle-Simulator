const ArmyRepository = require('../repository/armyRepository')

exports.registerArmy = (req, res) => {
  // provera paraetara
  const token = ArmyRepository.register(req.body.name, req.body.numOfSquads, req.body.webHook)
  return res.json({statusCode: 200, token })
}

exports.joinArmy = (req, res) => {
  console.log('usao u kontroler')
}
