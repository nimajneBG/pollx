const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
 
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
    levels: { 
        error: 0, 
        warn: 1, 
        info: 2,
        mysql: 3,
        http: 4,
        verbose: 5, 
        debug: 6, 
        silly: 7 
    },
    level: 'http',
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.File({ filename: 'log.log' }),
        new transports.Console({ level: 'mysql' })
    ]
})

module.exports = logger
