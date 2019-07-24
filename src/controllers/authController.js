const { register, joinArmy } = require('../services/armyService')

exports.registerArmy = async (obj) => {
  const { name, numOfSquads, webHook } = obj
  if (numOfSquads < 10 || numOfSquads > 100) {
    throw new Error('Allowed num of squads: min 10, max 100')
  }
  if (!name || !webHook) {
    throw new Error('Enter name and webHook')
  }
  const token = await register(name, numOfSquads, webHook)
  return token
}

exports.joinArmy = (token) => {
  joinArmy(token, (data) => {
    console.log(data)
    if (data) {
      return { statusCode: 200, message: 'Succesufylly joined' }
    }
    throw new Error('Unauthorized access')
  })
}
