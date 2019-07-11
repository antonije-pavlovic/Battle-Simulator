const ArmyRepository = require('../repository/armyRepository')

exports.registerArmy = (req, res) => {
  // provera paraetara
  console.log(req.body)
  const token = ArmyRepository.register(req.body.name, req.body.numOfSquads, req.body.webHook)
  return res.json({ statusCode: 200, token })
}

exports.joinArmy = (req, res) => {
  ArmyRepository.join(req.params.token, (data) => {
    console.log(data)
    if (data) {
      return res.json({ statusCode: 200, message: 'Succesufylly joined' })
    }
    return res.json({ statusCode: 401, message: 'Unauthorized access' })
  })
}
