const { query } = require('express')
const mysql = require('mysql')

// Load config
const { config } = require('../config')

// Create connection to the MySQL Server
let db = mysql.createConnection(config.db)

// Connect to database
db.connect(err => {
    if ( err ) {
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
    if ( isNaN(req.params.id) )
        return res.sendStatus(400)

    db.query('SELECT * FROM polls WHERE id = ?', [req.params.id], (err, result) => {
        // Error handeling
        if (err) {
            console.error(`[mysql] Error: ${err.message}`)
            res.status(500).json({ 'error_message' : 'Something went wrong' })
        } else if (result.length > 0) {
            result[0].answers = JSON.parse(result[0].answers)

            result[0].public = !!result[0].public

            delete result[0].email
            delete result[0].id
            delete result[0].public

            res.json(result[0])
        } else {
            res.sendStatus(404)
        }
    })
}

exports.createPoll = (req, res) => {
    const { title, description, public, email } = req.body

    let answers = req.body.answers

    if ( answers.length > 9 ) 
        answers = answers.slice(0, 9)

    // Check user input
    if ( title == undefined || description == undefined || public == undefined || answers == undefined || email == undefined )
        return res.sendStatus(400)

    if ( typeof title !== 'string' || typeof description !== 'string' || typeof public !== 'boolean' || !Array.isArray(answers) || !isValidEmail(email) )
        return res.sendStatus(400)

    const queryValuesPoll = {
        "title": title,
        "description": description,
        "public": public,
        "answers": JSON.stringify(answers),
        "email": email
    }
    
    db.query('INSERT INTO polls SET ?', queryValuesPoll, (err, result) => {
        if ( err ) {
            console.error(`[mysql] Error: ${err.message}`)
            res.sendStatus(500)
        } else {
            const id = result.insertId

            let queryValuesResults = { 'poll_id': id }

            for (let i = 0; i < answers.length; i++) {
                queryValuesResults[`opt${i}`] = 0
            }
        
            db.query('INSERT INTO results SET ?', queryValuesResults, (err2, result2) => {
                if ( err2 ) {
                    console.error(`[mysql] Error: ${err2.message}`)
                    res.send(500)
                } else {
                    res.json({ 'id': id })
                }
            })
        }
    })
}

exports.getResults = (req, res) => {
    if ( isNaN(req.params.id) )
        return res.sendStatus(400)
    
    db.query('SELECT * FROM results WHERE poll_id = ?', [req.params.id], (err, result) => {
        if ( err ) {
            console.error(`[mysql] Error: ${err.message}`)
            res.sendStatus(500)
        } else if ( result.length > 0 ) {
            delete result[0].poll_id
            res.json(result[0])
        } else {
            res.sendStatus(404)
        }
    })
}

exports.vote = (req, res) => {
    const { option } = req.body

    if ( option == undefined )
        return res.sendStatus(400)

    if ( typeof option !== 'number' )
        return res.sendStatus(400)
    
    if ( option < 0 )
        return res.sendStatus(400)

    if ( option > 9 )
        return res.sendStatus(400)
    
    if ( isNaN(req.params.id) )
        return res.sendStatus(400)

    const id = parseInt(req.params.id)

    let { voted_polls } = req.cookies

    if ( !voted_polls ) {
        voted_polls = new Array
    } else {
        voted_polls = JSON.parse(voted_polls)

        if (voted_polls.indexOf(id) != -1) 
            return res.json({ msg: 'Already voted on this poll'})
    }

    db.query('SELECT answers FROM polls WHERE id = ?', [id], (err, result) => {
        if ( err ) {
            console.error(`[mysql] Error: ${err.message}`)
            res.sendStatus(500)
        } else if ( result.length > 0 ) {
            result = result[0]

            const answersLength = JSON.parse(result.answers).length

            if ( answersLength > option ) {
                db.query('UPDATE results SET opt? = opt?+1 WHERE poll_id = ?', [option, option, id], (err2, result2) => {
                    if (err2) {
                        console.error(`[mysql] Error: ${err2.message}`)
                        res.sendStatus(500)
                    } else {
                        voted_polls.push(id)
                        res.clearCookie('voted_poll').cookie('voted_poll', JSON.stringify(voted_polls)).sendStatus(200)
                    }
                })
            }
        } else {
            res.sendStatus(404)
        }
    })
}
