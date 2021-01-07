const express = require('express')
const mysql = require('mysql')
const router = express.Router()

// Load config
const { config } = require('../config')


// Create connection to the MySQL Server
let db = mysql.createConnection(config.db)

// Connect to database
db.connect(err => {
    if (err) {
        return console.error(`[mysql] Error: ${err.message}`)
    }

    console.log('[mysql] Connected to database')
})

db.on('error',  err => {
    console.error(`[mysql] Error: ${err}`)
})


// GET Poll data
router.get('/poll/:id', (req, res) => {
    db.query('SELECT * FROM polls WHERE id = ?', [req.params.id], (err, result) => {
        // Error handeling
        if (err) {
            console.error(`[mysql] Error: ${err.message}`)
            res.status(500).send(`Something went wrong`)
        } else if (result.length > 0) {
            result[0].questions = JSON.parse(result[0].questions)

            res.json(result[0])
        } else {
            res.status(404).send(`Error: No Poll with id: ${req.params.id}`)
        }
    })
})

// GET Poll results
router.get('/results/:id', (req, res) => {
    res.json({
        'id': req.params.id
    })
})

// POST Vote
router.post('/vote/:id', (req, res) => {
    res.send(`Voted on poll: ${req.params.id}`)
    console.log(`Voted on poll: ${req.params.id}`)
})

// POST Create poll
router.post('/create-poll', (req, res) => {
    res.send('Create new poll')
})



module.exports = router