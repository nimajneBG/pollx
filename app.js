const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const app = express()
const path = require('path')
const loggerMiddleware = require('./middleware/logger')
const getUrlPrefix = require('./shared/functions/getUrlPrefix')

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
app.use(session({ secret: process.env.SECRET }))    // Init and use sessions

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
app.use('/src/webfonts', express.static(path.join(__dirname + '/node_modules/\@fortawesome/fontawesome-free/webfonts')))

// API
app.use('/api', api)

// Custom 404 and 500 error pages
app.use((req, res) => {
    console.log(req.originalUrl)
    res.status(404).render('error', { 
        error: '404 Not found', 
        urlPrefix: getUrlPrefix(req.originalUrl) 
    })
})


module.exports = app
