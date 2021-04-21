const mysql = require('mysql2/promise')
const logger = require('./logger')

// Create connection to the MySQL Server
let db = mysql.createPool({
    host                : process.env.DB_HOST || 'localhost',
    user                : process.env.DB_USER || 'root',
    password            : process.env.DB_PASSWORD,
    database            : 'pollx',
    waitForConnections  : true,
    connectionLimit     : process.env.DB_MAX_CONNECTIONS || 10,
    queueLimit          : 0
})

db.on('error',  err => {
    logger.mysql(err)
})

module.exports = db
