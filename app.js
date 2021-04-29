const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const app = express()
const path = require('path')

const loggerMiddleware = require('./middleware/logger')
const authMiddleware = require('./middleware/auth')

// Init dotenv
require('dotenv').config()

// Import routes
const pages = require('./routes/pages')
const api = require('./routes/api')

// Configure express
app.use(loggerMiddleware)
app.use(express.urlencoded({ extended : false }))
app.use(express.json())
app.use(cookieParser())                         // Use cookie parser
app.set('view engine', 'ejs')                   // Use ejs for rendering

// Init and use sessions
app.use(
    session({
        name: 'sid',
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            // Max age of the cookie (default 3 days)
            maxAge: (process.env.SESSION_MAX_AGE || 72) * 1000 * 60 * 60,
            sameSite: true
        }
    })
)

// Frontend

// Pages
app.use('/', pages)

// CSS
app.use('/src/css', express.static(path.join(__dirname + '/src/static/css')))

// JS
app.use('/src/js', express.static(path.join(__dirname + '/src/static/js')))

// Favicons
app.use('/', express.static(path.join(__dirname + '/src/logo')))

// Manifest
app.use('/', express.static(path.join(__dirname + '/src/config')))

// Font awesome
// Serves the webfont part of fontawesome from its folder in node_modules. 
// The CSS part is included by the scss but the webfont is needed for it to function
app.use('/src/webfonts', express.static(
    path.join(__dirname + '/node_modules/\@fortawesome/fontawesome-free/webfonts')
))

// API
app.use('/api', api)

// Custom 404 and 500 error pages
app.use((req, res) => {
    res.status(404).render('error', { 
        error: '404 Not found'
    })
})


module.exports = app
