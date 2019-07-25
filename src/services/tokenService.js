const jwt = require('jsonwebtoken')
/**
 * generate new token
*/
function getToken(army, secret, options) {
  return new Promise((resolve, reject) => {
    const token = jwt.sign(army, secret, { expiresIn: options.tokenLife })
    resolve(token)
  })
}

/**
 * verify and decode token
 */
function decodeToken(token, secret) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decode) => {
      if (err) {
        reject(err)
      }
      resolve(decode)
    })
  })
}

module.exports = { getToken, decodeToken }
