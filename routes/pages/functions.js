let db = require('../../shared/db')
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
