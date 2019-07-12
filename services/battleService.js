class BattleService {
  static chances (numOfSquads) {
    return 100 / numOfSquads
  }

  static probability (n) {
    return !!n && Math.random() <= n
  }

  static attackDamage (repeats, squads) {
    return squads / repeats
  }

  static recivedDemaga (squads) {
    return squads / 100 * 10
  }

}
