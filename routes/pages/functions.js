const bcrypt = require('bcrypt')

let db = require('../../shared/db')
const isValidEmail = require('../../shared/functions/isValidEmail')
const logger = require('./../../shared/logger')


exports.home = (req, res) => {
    res.render('index', {
        url: process.env.URL,
        urlPrefix: ''
    })
}

exports.poll = (req, res) => {
    if (isNaN(req.params.id))
        return res.status(400).render('error', {
            error: 'Invalid Id',
            urlPrefix: './../'
        })

    db.execute(
        'SELECT * FROM polls WHERE id = ?',
        [req.params.id],
        (err, result) => {
            // Error handeling
            if (err) {
                logger.mysql(err.message)
                res.status(500).render('error', {
                    error: 'Something went wrong',
                    urlPrefix: './../'
                })
            } else if (result.length > 0) {
                result = result[0]
                result.answers = JSON.parse(result.answers)

                result.public = !!result.public

                result.url = process.env.URL

                result.urlPrefix = './../'

                res.render('poll', result)
            } else {
                res.status(404).render('error', {
                    error: 'No poll with this id',
                    urlPrefix: './../'
                })
            }
        }
    )
}

exports.createPoll = (req, res) => {
    res.render('create-poll')
}

exports.search = (req, res) => {
    if ( req.query.q ) {
        const q = `%${req.query.q}%`
        db.execute(
            'SELECT title, description, id FROM polls WHERE ((title LIKE ?) OR (description LIKE ?)) AND public=1',
            [ q, q ],
            (err, result) => {
                if ( err ) {
                    logger.mysql(err.message)
                    res.status(500).render('error', {
                        error: 'Something went wrong',
                        urlPrefix: ''
                    })
                } else {
                    console.log(result)
                    res.render('search', {
                        url: process.env.URL,
                        urlPrefix: '',
                        title: 'Test',
                        result
                    })
                }
            }
        )
    } else {
        res.render('search', {
            url: process.env.URL,
            urlPrefix: '',
            title: 'Test',
        })
    }
}

exports.loginGet = (req, res) => {
    console.log(req.session)
    res.render('login', { urlPrefix: '/', url: process.env.URL })
}

exports.loginPost = (req, res) => {
    console.log(req.session)

    const { user_name, password } = req.body

    if ( user_name == undefined || password == undefined ) {
        return res
            .status(400)
            .render('login', {
                urlPrefix: '/', 
                url: process.env.URL, 
                message: 'You need to input a password and username' 
            })
    }

    if ( typeof user_name !== 'string' || typeof password !== 'string' ) {
        return res
            .status(400)
            .render('login', { urlPrefix: '/', url: process.env.URL })
    }

    db.execute('SELECT id, password FROM users WHERE name=?', [user_name], async (err, result) => {
        if (err) {
            logger.mysql(err.message)
            return res
                .status(500)
                .render('error', {
                    urlPrefix: '/',
                    url: process.env.URL, 
                    error: err.message
                })
        }

        console.log(result)

        if (!result.length) {
            return res
                .status(400)
                .render('login', { 
                    urlPrefix: '/', 
                    url: process.env.URL, 
                    message: 'No user with this name' 
                })
        }
        
        if (await bcrypt.compare(password, result[0].password)) {
            req.session.userID = result[0].id
            return res.redirect('/dashboard')
        }
        
        res
            .status(400)
            .render('login', { 
                urlPrefix: '/', 
                url: process.env.URL, 
                message: 'Incorrect password'
            })
    })
}

exports.registerGet = (req, res) => {
    console.log(req.session)
    res.render('register', { urlPrefix: '/', url: process.env.URL })
}

exports.registerPost = (req, res) => {
    console.log(req.session)
    const { user_name, email, password, password_repeat } = req.body

    console.log(req.body)

    // Check whether all params exist
    if (!user_name || !email, !password, !password_repeat) {
        console.log('Sind da')
        return res
            .status(400)
            .render('register', { urlPrefix: '/', url: process.env.URL })
    }

    // Check whether they are of the right type
    if (
        typeof user_name !== 'string' || 
        typeof email !== 'string' || 
        typeof password !== 'string' || 
        typeof password_repeat !== 'string'
    ) {
        console.log('typeof')
        return res
            .status(400)
            .render('register', { urlPrefix: '/', url: process.env.URL })
    }

    // Check whether the email is valid, the passwords are the same and long enough
    if (!isValidEmail(email) || password.length < 6 || password !== password_repeat) {
        return res
            .status(400)
            .render('register', { urlPrefix: '/', url: process.env.URL })
    }

    // Check whether the email is already in use
    db.execute('SELECT * FROM users WHERE email=?', [email], async (err, result) => {
        if (err) {
            logger.mysql(err.message)
            return res
                .status(500)
                .render('error', {
                    urlPrefix: '/', 
                    url: process.env.URL, 
                    error: err.message
                })
        }

        if (result.length) {
            return res
                .status(400)
                .render('register', {
                    urlPrefix: '/', 
                    url: process.env.URL, 
                    message:  'This Email is already in use'
                })
        }

        // Hash the password
        const hash = await bcrypt.hash(password, process.env.SALT_ROUNDS || 10)

        // Create user in the database
        db.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [user_name, email, hash],
            (err2, result2) => {
                if (err2) {
                    logger.mysql(err2.message)
                    return res
                        .status(500)
                        .render('error', {
                            urlPrefix: '/', 
                            url: process.env.URL, 
                            error: err2.message
                        })
                }

                // Login
                req.session.userID = result2.insertId

                res.redirect('/dashboard')
            }
        )
    })
}

exports.logout = (req, res) => {
    res.clearCookie('sid')
    res.send('<h1>Logged out</h1>')
}

exports.dashboard = (req, res) => {
    res.render('dashboard', { urlPrefix: '/', url: process.env.URL })
}
