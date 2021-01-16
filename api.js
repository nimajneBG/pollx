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
    const { title, description, public, answers } = req.body
    if ( (title == undefined || description == undefined || public == undefined || answers == undefined) || ( typeof title !== 'string' || typeof description !== 'string' || typeof public !== 'boolean' || typeof answers !== 'object' ) ) {
        return res.sendStatus(400)
    }

    /*
    db.querry('INSERT INTO polls SET ?', querryValues, (err, result) => {

    })*/
    res.json(req.body)
}

exports.getResults = (req, res) => {
    res.json({
        'id': req.params.id
    })
}

exports.vote = (req, res) => {
    res.send(`Voted on poll: ${req.params.id}`)
}