let db = require('../../shared/db')
const logger = require('./../../shared/logger')
const getUrlPrefix = require('./../../shared/functions/getUrlPrefix')
const { url } = require('../../shared/config').config


exports.home = (req, res) => {
    res.render('index', { url })
}

exports.poll = (req, res) => {
    if ( isNaN(req.params.id) )
        return res.status(400).render('error', { 
            error: 'Invalid Id',
            urlPrefix: getUrlPrefix(req.originalUrl)
        })

    db.query('SELECT * FROM polls WHERE id = ?', [req.params.id], (err, result) => {
        // Error handeling
        if (err) {
            logger.mysql(err.message)
            res.status(500).render('error', { 
                error : 'Something went wrong',
                urlPrefix: getUrlPrefix(req.originalUrl)
            })
        } else if (result.length > 0) {
            result = result[0]
            result.answers = JSON.parse(result.answers)

            result.public = !!result.public

            result.url = url

            res.render('poll', result)
        } else {
            res.status(404).render('error', { 
                error: 'No poll with this id',
                urlPrefix: getUrlPrefix(req.originalUrl)
            })
        }
    })
}

exports.createPoll = (req, res) => {
    res.render('create-poll')
}
