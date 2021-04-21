const isValidEmail = require('../../shared/functions/isValidEmail')
let db = require('../../shared/db')
const logger = require('../../shared/logger')
const { format } = require('mysql2')


exports.createPoll = async (req, res) => {
    const {
        title,
        description,
        publicStatus,
        email
    } = req.body

    let answers = req.body.answers

    if (answers.length > 9)
        answers = answers.slice(0, 9)

    // Check user input
    if (
        title == undefined ||
        description == undefined ||
        publicStatus == undefined ||
        answers == undefined ||
        email == undefined
    )
        return res.sendStatus(400)

    if (
        typeof title !== 'string' ||
        typeof description !== 'string' ||
        typeof publicStatus !== 'boolean' ||
        !Array.isArray(answers) ||
        !isValidEmail(email)
    )
        return res.sendStatus(400)

    // Use the same connection for both querries
    const conn = await db.getConnection()

    try {
        // Create the row in the poll table
        const [result] = await conn.execute(
            'INSERT INTO polls (title, description, public, answers, email) VALUES (?, ?, ?, ?, ?)',
            [title, description, publicStatus, JSON.stringify(answers), email]
        )

        const id = result.insertId

        let queryValuesResults = {
            'poll_id': id
        }

        // Create part of the query for the results table
        // Set the fields which can be voted on as a 0 so they are not NULL
        for (let i = 0; i < answers.length; i++) {
            queryValuesResults[`opt${i}`] = 0
        }

        // Create the row in the table results
        try {
            await conn.execute(
                // Using the not so safe format function because execute doesn't 
                // allow the the SET ? syntax with a object as parameter
                format('INSERT INTO results SET ?', queryValuesResults),
            )
        } catch(err) {
            // TODO: Delete the row that was already inserted in the first query
            // if an error is thrown in the second

            logger.mysql(err.message)
            return res
                .sendStatus(500)
        } 

        // Send the id the new poll got as the answer
        res.json({
            id
        })

        logger.info(`Created new poll ID: ${id}`)
    } catch(err) {
        logger.mysql(err.message)
        res.sendStatus(500)
    }

    // Release the now longer used connection
    await conn.release()
}

exports.getResults = async (req, res) => {
    if (!req.params.id)
        return res.sendStatus(400)

    if (isNaN(req.params.id))
        return res.sendStatus(400)


    try {
        let [result] = await db.execute(
            'SELECT * FROM results WHERE poll_id = ?',
            [req.params.id]
        )

        if (result.length > 0) {
            [result] = result
            delete result.poll_id

            let resultArray = new Array
            for (let i = 0; i < 10; i++) {
                const indexName = `opt${i}`
                if (result[indexName] || result[indexName] === 0) {
                    resultArray.push(result[indexName])
                } else {
                    break
                }
            }

            res.json(resultArray)
        } else {
            res.sendStatus(404)
            logger.debug(`Tried to get results of non existent poll ID: ${req.params.id}`)
        }
    } catch(err) {
        logger.mysql(err.message)
        res.sendStatus(500)
    }
}

exports.vote = async (req, res) => {
    const {
        option
    } = req.body

    if (option == undefined)
        return res.sendStatus(400)

    if (typeof option !== 'number' || isNaN(req.params.id))
        return res.sendStatus(400)

    if (option < 0 || option > 9)
        return res.sendStatus(400)

    const id = parseInt(req.params.id)

    let {
        voted_polls
    } = req.cookies

    if (!voted_polls) {
        voted_polls = new Array
    } else {
        voted_polls = JSON.parse(voted_polls)

        if (voted_polls.indexOf(id) != -1)
            return res.json({
                msg: 'Already voted on this poll'
            })
    }

    // Use the same connection for both queries
    const conn = await db.getConnection()

    try {
        let [result] = await conn.execute(
            'SELECT answers FROM polls WHERE id = ?', 
            [id]
        ) 

        if (result.length > 0) {
            result = result[0]

            const answersLength = JSON.parse(result.answers).length

            if (answersLength > option) {
                await conn.execute(
                    format(
                        'UPDATE results SET opt? = opt?+1 WHERE poll_id = ?',
                        [option, option]
                    ),
                    [id]
                )
                
                // Add the id to the cookie
                voted_polls.push(id)
                res.clearCookie('voted_polls')
                    .cookie(
                        'voted_polls', 
                        JSON.stringify(voted_polls), 
                        { maxAge: 3153600000000 }   // 100 Years in milliseconds
                    )
                    .sendStatus(200)
            } else {
                // Invalid option number
                return res
                    .sendStatus(400)
            }

        } else {
            res.sendStatus(404)
        }
    } catch(err) {
        logger.mysql(err.message)
        res.sendStatus(502)
    }

    // Free up the connection
    await conn.release()
}

exports.getRandomPolls = async (req, res) => {
    const max = req.params.max || 4

    if (isNaN(max))
        return res.sendStatus(400)

    try {
        const [result] = await db.execute(
            'SELECT title, description, id FROM polls WHERE public=1 ORDER BY RAND() LIMIT ?',
            [max]
        )
        
        res.json(result)

    } catch(err) {
        logger.mysql(err.message)
        res.sendStatus(500)
    }
}
