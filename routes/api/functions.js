const isValidEmail = require('../../shared/functions/isValidEmail')
let db = require('../../shared/db')
const logger = require('../../shared/logger')


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
            logger.mysql(err.message)
            res.sendStatus(500)
        } else {
            const id = result.insertId

            let queryValuesResults = { 'poll_id': id }

            for (let i = 0; i < answers.length; i++) {
                queryValuesResults[`opt${i}`] = 0
            }
        
            db.query('INSERT INTO results SET ?', queryValuesResults, (err2, result2) => {
                if ( err2 ) {
                    logger.mysql(err2.message)
                    res.send(500)
                } else {
                    res.json({ 'id': id })
                    logger.info(`Created new poll ID: ${id}`)
                }
            })
        }
    })
}

exports.getResults = (req, res) => {
    if ( !req.params.id )
        return res.sendStatus(400)

    if ( isNaN(req.params.id) )
        return res.sendStatus(400)
    
    db.query('SELECT * FROM results WHERE poll_id = ?', [req.params.id], (err, result) => {
        if ( err ) {
            logger.mysql(err.message)
            res.sendStatus(500)
        } else if ( result.length > 0 ) {
            result = result[0]
            delete result.poll_id
            
            let resultArray = new Array
            for ( let i = 0; i < 10; i++ ) {
                const indexName = `opt${i}`
                if ( result[indexName] || result[indexName] === 0 )
                    resultArray.push(result[indexName])
            }

            res.json(resultArray)
        } else {
            res.sendStatus(404)
            logger.debug(`Tried to get results of non existent poll ID: ${req.params.id}`)
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
            logger.mysql(err.message)
            res.sendStatus(500)
        } else if ( result.length > 0 ) {
            result = result[0]

            const answersLength = JSON.parse(result.answers).length

            if ( answersLength > option ) {
                db.query('UPDATE results SET opt? = opt?+1 WHERE poll_id = ?', [option, option, id], (err2, result2) => {
                    if (err2) {
                        logger.mysql(err2.message)
                        res.sendStatus(500)
                    } else {
                        voted_polls.push(id)
                        res.clearCookie('voted_polls').cookie('voted_polls', JSON.stringify(voted_polls)).sendStatus(200)
                    }
                })
            }
        } else {
            res.sendStatus(404)
        }
    })
}

exports.getRandomPolls = (req, res) => {
    const max = req.body.max || 4

    if (typeof max !== 'number')
        return res.sendStatus(400)

    db.query('SELECT title, description, id FROM polls WHERE public=1 ORDER BY RAND() LIMIT ?', [ max ], (err, result) => {
        if ( err ) {
            logger.mysql(err.message)
            res.send(500)
        } else {
            res.json(result)
        }

    })
}
