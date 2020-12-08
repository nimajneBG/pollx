const express = require('express')
const app = express()
const mysql = require('mysql')

// Load config
const { config } = require('./config')


// Create connection to the MySQL Server
let db = mysql.createConnection(config.db)

// Connect to database
db.connect(err => {
    if (err) {
        return console.error(`Error: ${err.message}`)
    }

    console.log('Connected to database')
})


// Frontend

// Static (CSS & JS)
app.use('/src/', express.static('src/static'))

// GET Home
app.get('/', (req, res) => {
    res.send('Homepage')
})

// GET Poll
app.get('/poll/:id', (req, res) => {
    res.send(`Poll: ${req.params.id}`)
})

// GET Create poll
app.get('/create-poll', (res, req) => {
    res.send('Create new Poll')
})


// API

// GET Poll data
app.get('/api/poll/:id', (req, res) => {
    // SQL Query
    let sql = 'SELECT * FROM polls WHERE id = ' + req.params.id

    db.query(sql, (err, result) => {
        // Error handeling
        if (err) {
            return console.error(`Error: ${err.message}`);
        }

        if (result.length > 0) 
        {
            result[0].questions = JSON.parse(result[0].questions)

            res.json(result[0])
        }
        else 
        {
            res.status(404).send(`Error: No Poll with id: ${req.params.id}`)
        }
    })
})

// GET Poll results
app.get('/api/results/:id', (req, res) => {
    res.json({
        "id": req.params.id
    })
})

// POST Vote
app.post('/api/vote/:id', (req, res) => {
    res.send(`Voted on poll: ${req.params.id}`)
    console.log('Voted')
})

// POST Create poll
app.post('/api/create-poll', (req, res) => {
    res.send('Create new poll')
})


// Start server
app.listen(config.port, () => {
    console.log(`POLLX running at http://localhost:${config.port}`)
})