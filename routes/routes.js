const Auth = require('../controllers/authController')
const Battle = require('../controllers/battleController')

const routes = (app) => {
  app.post('/api/join/:token?', (req, res) => {
    if (req.params.token) {
      Auth.joinArmy(req, res)
    } else {
      Auth.registerArmy(req, res)
    }
  })
  app.put('/api/attack/:armyId/:token', (req, res) => {
    Battle.attack(req, res)
  })
  app.put('/api/leave/:token', Battle.leave)
}
module.exports = routes
