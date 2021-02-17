const mysql = require('mysql')
const logger = require('./logger')

// Load config
const { config } = require('./config')

// Create connection to the MySQL Server
let db = mysql.createConnection(config.db)

// Connect to database
db.connect(err => {
    if ( err ) {
        return logger.mysql(err.message)
    }

    logger.mysql('Connected to database')
})

db.on('error',  err => {
    logger.mysql(err)
})

module.exports = db
