const express = require('express')
const app = express()
const path = require('path')

// Load config
const { config } = require('./config')

// Import routes
const pages = require('./routes/pages')
const api = require('./routes/api')

// Configure express
app.use(express.urlencoded({ extended : false }))
app.use(express.json())

// Frontend

// Pages
app.use('/', pages)

// Static (CSS & JS)
app.use('/src/', express.static(path.join(__dirname + '/src/static')))

// Favicons
app.use('/', express.static(path.join(__dirname + '/src/logo')))

// Manifest
app.use('/', express.static(path.join(__dirname + '/src/config')))

// API
app.use('/api', api)

// Start server
app.listen(config.port, () => {
    console.log(`
 _______         __   __           
|_   __ \\       [  | [  |          
  | |__) | .--.  | |  | |  _   __  
  |  ___// .'\`\\ \\| |  | | [ \\ [  ] 
 _| |_   | \\__. || |  | |  > '  <  
|_____|   '.__.'[___][___][__]\`\\_] 

    `)
    console.log(`... running at http://localhost:${config.port}\n\n`)
})
