const { register, joinArmy } = require('../repository/armyRepository')

exports.registerArmy = async (req, res) => {
  const { name, numOfSquads, webHook } = req.body
  if (numOfSquads < 10 || numOfSquads > 100) {
    return res.status(422).send('Allowed num of squads: min 10, max 100')
  }
  if (!name || !webHook) {
    return res.status(422).send('Enter name and webHook')
  }
  await register(name, numOfSquads, webHook)
    .then(token => res.json({ statusCode: 200, token }))
}

exports.joinArmy = (req, res) => {
  joinArmy(req.params.token, (data) => {
    console.log(data)
    if (data) {
      return res.json({ statusCode: 200, message: 'Succesufylly joined' })
    }
    return res.json({ statusCode: 401, message: 'Unauthorized access' })
  })
}
