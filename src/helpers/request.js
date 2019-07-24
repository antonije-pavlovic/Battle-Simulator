const request = require('request')

function Request(method, uri, form) {
  return new Promise((resolve, reject) => {
    request({ method, uri, form }, (err, response) => {
      if (err) {
        reject(err)
      }
      resolve(response)
    })
  })
}
module.exports = { Request }
