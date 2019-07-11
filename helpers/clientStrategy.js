module.exports = (data, type) => {
  let armyId = 0
  if (type === 'weakest') {
    let tmp = 100
    for (let i = 0; i < data.length; i + 1) {
      if (data[i].numOfSquads < tmp) {
        tmp = data[i].numOfSquads
        armyId = data[i].armyId
      }
    }
  }
  if (type === 'strongest') {
    let tmp = 0
    for (let i = 0; i < data.length; i + 1) {
      if (data[i].numOfSquads > tmp) {
        tmp = data[i].numOfSquads
        armyId = data[i].armyId
      }
    }
  }
  if (type === 'random') {
    const randomNumber = Math.floor(Math.random() * data.length)
    armyId = data[randomNumber].armyId
  }
  return armyId
}
