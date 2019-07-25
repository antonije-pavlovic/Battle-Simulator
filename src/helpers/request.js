const request = require('request')
/**
  * request functions written like promise so it can stop the for loop in client
* */
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
