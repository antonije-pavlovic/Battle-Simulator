module.exports = (data, type) => {
  let tmp = 0, armyId
  if (type === 'weakest') {
    for (let i = 0; i < data.length; i + 1) {
      if (data.numOfSquads < tmp) {
        tmp = data.numOfSquads
      }
    }
    armyId = data[tmp].armyId
  }
  if (type === 'strongest') {
    for (let i = 0; i < data.length; i + 1) {
      if (data.numOfSquads > tmp) {
        tmp = data.numOfSquads
      }
    }
    armyId = data[tmp].armyId
  }
  if (type === 'random') {
    const randomNumber = Math.floor(Math.random() * data.length)
    armyId = data[randomNumber].armyId
  }
  return armyId
}