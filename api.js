const { query } = require('express')
const mysql = require('mysql')

// Load config
const { config } = require('./config')

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

const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/

isValidEmail = email => {
    if (email.length >= 5)
        return emailRegex.test(email)
    else 
        return false
}

exports.getPollData = (req, res) => {
    db.query('SELECT * FROM polls WHERE id = ?', [req.params.id], (err, result) => {
        // Error handeling
        if (err) {
            console.error(`[mysql] Error: ${err.message}`)
            res.status(500).json({ 'error_message' : 'Something went wrong' })
        } else if (result.length > 0) {
            result[0].answers = JSON.parse(result[0].answers)

            result[0].public = !!result[0].public

            res.json(result[0])
        } else {
            res.status(404).json({ 'error_message' : `Error: No Poll with id: ${req.params.id}` })
        }
    })
}

exports.createPoll = (req, res) => {
    const { title, description, public, answers, email } = req.body

    // Check user input
    if ( title == undefined || description == undefined || public == undefined || answers == undefined || email == undefined )
        return res.sendStatus(400)

    if ( typeof title !== 'string' || typeof description !== 'string' || typeof public !== 'boolean' || typeof answers !== 'object' || !isValidEmail(email) )
        return res.sendStatus(400)

    const queryValues = {
        "title": title,
        "description": description,
        "public": public,
        "answers": JSON.stringify(answers),
        "email": email
    }
    
    db.query('INSERT INTO polls SET ?', queryValues, (err, result) => {
        if (err) {
            console.error(`[mysql] Error: ${err.message}`)
            res.sendStatus(500)
        }

        res.json({ 'id': result.insertId })
    })
}

exports.getResults = (req, res) => {
    res.json({
        'id': req.params.id
    })
}

exports.vote = (req, res) => {
    res.send(`Voted on poll: ${req.params.id}`)
}
