const WebHooks = require('node-webhooks')
const BattleRepository = require('../repository/BattleRepository')

exports.join = (army, armies, type) => {
  armies
    .then(async (data) => {
      const hooks = new WebHooks({
        db: { urls: data.map(url => url.webHook) },
        httpSuccessCodes: [200, 201]
      })
      const { urls } = await hooks.getDB()
      console.log(army)
      console.log(urls)
      urls.map(url => hooks.add('join', `${url}/join`))
      hooks.trigger('join', { army, type })
      const emitter = hooks.getEmitter()
      emitter.on('*.success', (shortname, statusCode, body) => {
        if (statusCode !== 200) {
          BattleRepository.leave(body)
        }
      })
    })
}

exports.leave = (armyId, armies, type) => {
  armies.then(async (data) => {
    const hooks = new WebHooks({
      db: { urls: data.map(url => url.webHook) },
      httpSuccessCodes: [200, 201]
    })
    const { urls } = await hooks.getDB()
    urls.map(url => hooks.add('leave', `${url}/leave`))
    hooks.trigger('leave', { armyId, type })
  })
}
