const jwt = require('jsonwebtoken')

class TokenService {
  static getToken (army, secret, options) {
    const token = jwt.sign(army, secret, { expiresIn: options.tokenLife })
    return token
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
