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

exports.poll = async (req, res) => {
    if (isNaN(req.params.id))
        return res.status(400).render('error', {
            error: 'Invalid Id',
            urlPrefix: './../'
        })

    try {
        let [result] = await db.execute(
            'SELECT * FROM polls WHERE id = ?',
            [req.params.id]
        )

        if (result.length > 0) {
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
    } catch(err) {
        logger.mysql(err.message)
        res.status(500).render('error', {
            error: 'Something went wrong',
            urlPrefix: './../'
        })
    }
}

exports.createPoll = async (req, res) => {
    res.render('create-poll')
}

exports.search = async (req, res) => {
    if ( req.query.q ) {
        const q = `%${req.query.q}%`

        try {
            const [result] = await db.execute(
                'SELECT title, description, id FROM polls WHERE ((title LIKE ?) OR (description LIKE ?)) AND public=1',
                [ q, q ]
            )

            res.render('search', {
                url: process.env.URL,
                urlPrefix: '',
                title: req.query.q,
                result
            })
        } catch(err) {
            logger.mysql(err.message)
            res.status(500).render('error', {
                error: 'Something went wrong',
                urlPrefix: ''
            })
        }
    } else {
        res.render('search', {
            url: process.env.URL,
            urlPrefix: ''
        })
    }
}

exports.login = {

    get: (req, res) => {
        res.render('login', { urlPrefix: '/', url: process.env.URL })
    },

    post: async (req, res) => {
    
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
    
        try {
            const [result] = await db.execute(
                'SELECT id, password FROM users WHERE name=?', 
                [user_name]
            )
    
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
        } catch(err) {
            logger.mysql(err.message)
            res
                .status(500)
                .render('error', {
                    urlPrefix: '/',
                    url: process.env.URL, 
                    error: err.message
                })
        }
    }
}

exports.register = {

    get: (req, res) => {
        res.render('register', { urlPrefix: '/', url: process.env.URL })
    },

    post: async(req, res) => {
        const { user_name, email, password, password_repeat } = req.body
    
        // Check whether all params exist
        if (!user_name || !email, !password, !password_repeat) {
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
            return res
                .status(400)
                .render('register', { urlPrefix: '/', url: process.env.URL })
        }
    
        // Check whether the email is valid, the passwords are the same and long enough
        if (
            !isValidEmail(email) || 
            password.length < 6 || 
            password !== password_repeat
        ) {
            return res
                .status(400)
                .render('register', { urlPrefix: '/', url: process.env.URL })
        }
    
        const conn = await db.getConnection()
    
        try {
            // Check whether the email is already in use
            const [result] = await conn.execute(
                'SELECT * FROM users WHERE email=?',
                [email]
            )
    
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
            const hash = await bcrypt.hash(
                password, process.env.SALT_ROUNDS || 10
            )
    
            // Create user in the database
            const [result2] = await conn.execute(
                'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                [user_name, email, hash]
            )
            
            // Login
            req.session.userID = result2.insertId
    
            res.redirect('/dashboard')
        } catch(err) {
            logger.mysql(err.message)
            res
                .status(500)
                .render('error', {
                    urlPrefix: '/', 
                    url: process.env.URL, 
                    error: err.message
                })
        }
    
        await conn.release()
    }
}

exports.logout = (req, res) => {
    res.clearCookie('sid')
    res.send('<h1>Logged out</h1>')
}

exports.dashboard = (req, res) => {
    res.render('dashboard', { urlPrefix: '/', url: process.env.URL })
}
