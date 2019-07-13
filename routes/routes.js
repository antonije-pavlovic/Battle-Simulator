const { joinArmy, registerArmy } = require('../controllers/authController')
const { repeatHelper, attack, leave } = require('../controllers/battleController')

const routes = (app) => {
  app.post('/api/join/:token?', (req, res) => {
    if (req.params.token) {
      joinArmy(req, res)
    } else {
      registerArmy(req, res)
    }
  })
  app.put('/api/attack/:armyId/:token', repeatHelper, attack)
  app.put('/api/leave/:token', leave)
}
module.exports = routes
