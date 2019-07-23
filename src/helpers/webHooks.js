const WebHooks = require('node-webhooks')
const { leaveBattle } = require('../repository/armyRepository')

exports.join = async (army, armies, type) => {
  const hooks = new WebHooks({
    db: { urls: armies.map(url => url.webHook) },
    httpSuccessCodes: [200, 201],
  })
  console.log('---------------------------------');
  console.log(armies);
  const { urls } = await hooks.getDB()
  urls.map(url => hooks.add('join', `${url}/join`))
  hooks.trigger('join', { armies, type, army })
  const emitter = hooks.getEmitter()
  emitter.on('*.success', (shortname, statusCode, body) => {
    if (statusCode !== 200) {
      leaveBattle(body)
    }
  })
}

exports.leave = async (armyId, armies, type) => {
  const hooks = new WebHooks({
    db: { urls: armies.map(url => url.webHook) },
    httpSuccessCodes: [200, 201],
  })
  const { urls } = await hooks.getDB()
  urls.map(url => hooks.add('leave', `${url}/leave`))
  hooks.trigger('leave', { armyId, armies, type })
}

exports.update = async (army, data) => {
  const hooks = new WebHooks({
    db: { urls: army.map(url => url.webHook) },
    httpSuccessCodes: [200, 201],
  })
  const { urls } = await hooks.getDB()
  urls.map(url => hooks.add('demage', `${url}/update`))
  hooks.trigger('demage', { armyId: army[0]._id, squadsCount: data.squadsCount, rankRate: data.rank })
  const emitter = hooks.getEmitter()
  emitter.on('*.success', (shortname, statusCode, body) => {
    if (statusCode !== 200) {
      leaveBattle(body)
    }
  })
}
