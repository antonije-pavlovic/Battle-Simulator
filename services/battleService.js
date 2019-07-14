function chances (numOfSquads) {
  const data = numOfSquads / 100
  console.log(data)
  return data
}

function probability (n) {
  const prob = !!n && Math.random() <= n
  console.log('mogucnost' + prob)
  return prob
}

function attackDamage (repeats, squads) {
  return squads / repeats
}

function recivedDemage (squads) {
  return squads / 100 * 10
}
module.exports = {chances, probability, attackDamage, recivedDemage}
