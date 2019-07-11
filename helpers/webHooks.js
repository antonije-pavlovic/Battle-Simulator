const WebHooks = require('node-webhooks')

exports.join = (army, armies, type) => {
  armies.then(async (data) => {
    const hooks = new WebHooks({
      db: { urls: data.map(url => url.webHook) },
      httpSuccessCodes: [200, 201]
    })
    const { urls } = await hooks.getDB()
    urls.map(url => hooks.add('join', `${url}/join`))
    hooks.trigger('join', { army, type })
    const emitter = hooks.getEmitter()
    emitter.on('*.success', (shortname, statusCode, body) => {
      console.log(statusCode)
    })
    emitter.on('*.failure', (shortname, statusCode, body) => {
      console.log(statusCode)
    })
  })
}
