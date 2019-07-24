const { joinArmy, registerArmy } = require('../controllers/authController')
const { repeatHelper, attack, leave } = require('../controllers/battleController')

const routes = (app) => {
  app.post('/api/join/:token?', async (req, res, next) => {
    try {
      if (req.params.token) {
        const obj = joinArmy(req.params.token)
        res.locals.data = obj
      } else {
        const token = await registerArmy(req.body)
        res.locals.data = { token }
      }
      next(null)
    } catch (e) {
      next(e)
    }
  })
  app.put('/api/attack/:armyId/:token', repeatHelper, async (req, res, next) => {
    try {
      const battleStatistic = await attack(req.params)
      res.local.data =  battleStatistic
      next(null)
    } catch (e) {
      next(e)
    }
  })

  app.put('/api/leave/:token', leave)
  app.use((req, res, next) => {
    const { data } = res.locals
    res.status(200).send(data)
  })
  app.use((err, req, res, next) => {
    if (!err) next()
    res.status(400).send(err)
  })
}
module.exports = routes
