const Army = require('../domain/army')

function getAlive() {
  return Army.find({ squads: { $gt: 0 }, active: true })
}

function getOrderedArmies() {
  return Army.find({ squads: { $gt: 0 }, active: true }).sort({ squads: 'desc' })
}

function getArmyById(id) {
  return Army.findOne({ _id: id, active: true })
}

async function insertArmy(name, squads, webHook) {
  const army = new Army({
    name,
    squads,
    webHook,
    active: true,
  })
  await army.save()
  return army
}
module.exports = {
  getOrderedArmies,
  getAlive,
  getArmyById,
  insertArmy,
}
