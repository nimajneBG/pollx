const logger = require('../shared/logger')

const loggerMiddleware = (req, res, next) => {
    logger.http(req.originalUrl)
    next()
}


module.exports = loggerMiddleware
