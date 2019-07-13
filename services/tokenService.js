const jwt = require('jsonwebtoken')

class TokenService {
  static getToken (army, secret, options) {
    return new Promise((resolve, reject) => {
      const token = jwt.sign(army, secret, { expiresIn: options.tokenLife })
      resolve(token)
    })
  }

  static decodeToken (token, secret) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decode) => {
        if (err) {
          reject()
        }
        resolve(decode)
      })
    })
  }
}
module.exports = TokenService
