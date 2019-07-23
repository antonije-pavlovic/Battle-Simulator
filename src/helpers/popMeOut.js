function popMeOut(fighters, me) {
  for (let i = 0; i < fighters.length; i += 1) {
    if (fighters[i].name === me) {
      fighters.splice(i, 1)
    }
  }
  return fighters
}
module.exports = { popMeOut }
