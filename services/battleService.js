class BattleService {
  static chances (numOfSquads) {
    const data = 100 / numOfSquads
    console.log(data)
  }

  static probability (n) {
    const prob = !!n && Math.random() <= n
    console.log('mogucnost' + prob)
  }

  static attackDamage (repeats, squads) {
    return squads / repeats
  }

  static recivedDemaga (squads) {
    return squads / 100 * 10
  }
}
module.exports = BattleService
