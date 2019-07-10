const jwt = require('jsonwebtoken')

class TokenService {
  static getToken (army, secret, options) {
    const token = jwt.sign(army, secret, { expiresIn: options.tokenLife })
    return token
  }
}
module.exports = TokenService
