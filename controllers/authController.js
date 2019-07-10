const ArmyRepository = require('../repository/armyRepository')

exports.registerArmy = (req, res) => {
  // provera paraetara
  ArmyRepository.register(req.body.name, req.body.numOfSquads, req.body.webHook)
  return res.send(200)
}

exports.joinArmy = (req, res) => {
  console.log('usao u kontroler')
}
