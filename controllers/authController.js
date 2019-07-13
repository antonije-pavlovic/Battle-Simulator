const ArmyRepository = require('../repository/armyRepository')

exports.registerArmy = (req, res) => {
  if (req.body.numOfSquads < 10 || req.body.numOfSquads > 100) {
    return res.status(422).send('Allowed num of squads: min 10, max 100')
  }
  if (!req.body.name || !req.body.webHook) {
    return res.status(422).send('Enter name and webHook')
  }
  console.log(req.body)
  ArmyRepository.register(req.body.name, req.body.numOfSquads, req.body.webHook)
    .then(token => res.json({ statusCode: 200, token }))
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
