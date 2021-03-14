const mysql = require('mysql2')
const logger = require('./logger')

// Load config
const { config } = require('./config')

// Create connection to the MySQL Server
let db = mysql.createPool(config.db)

db.on('error',  err => {
    logger.mysql(err)
})

module.exports = db
