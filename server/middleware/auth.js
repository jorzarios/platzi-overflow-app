import Debug from 'debug';
import { secret } from '../config';
import jwt from 'jsonwebtoken'

const debug = new Debug('platzi-overflow:middleware-auth')

export const required = (req, res, next) => {
  jwt.verify(req.query.token, secret, (err, token) => {
    if(err) {
      debug(`Token NOT verified ${token}`)
      return res.status(401).json({
        message: 'Unauthorized',
        error: err
      })
    }
    debug(`Token verified ${token}`)
    req.user = token.user
    next()
  })
}
