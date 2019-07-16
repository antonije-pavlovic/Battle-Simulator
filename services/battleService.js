function chances (numOfSquads) {
  return numOfSquads / 100
}

function probability (n) {
  console.log('probability')
  console.log(n)
  return !!n && Math.random() <= n
}

function attackDamage (repeats, squads) {
  return squads / repeats
}

function recivedDemage (squads) {
  return squads / 100 * 10
}
module.exports = {
  chances,
  probability,
  attackDamage,
  recivedDemage
}
