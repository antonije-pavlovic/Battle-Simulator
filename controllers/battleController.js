const BattleRepository = require('../repository/BattleRepository')

exports.attack = (req, res) => {
  //  do something
}
exports.leave = (req, res) => {
  BattleRepository.leave(req.params.token)
}