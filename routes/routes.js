const Auth = require('../controllers/authController')
const Battle = require('../controllers/battleController')

const routes = (app) => {
  app.post('/api/join', (req, res) => {
    Auth.registerArmy(req, res)
  })
  app.post('/api/join/', (req, res) => {
    Auth.joinArmy(req, res)
  })
  app.put('/api/attack/{armyId}', (req, res) => {
    Battle.attack(req, res)
  })
  app.put('/api/leave', (req, res) => {
    Battle.leave(req, res)
  })
}
module.exports = routes
