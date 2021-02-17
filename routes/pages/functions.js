let db = require('../../shared/db')


exports.poll = (req, res) => {
    if ( isNaN(req.params.id) )
        return res.status(400).render('error', { error: 'Invalid Id' })

    db.query('SELECT * FROM polls WHERE id = ?', [req.params.id], (err, result) => {
        // Error handeling
        if (err) {
            logger.mysql(err.message)
            res.status(500).render('error', { 'error' : 'Something went wrong' })
        } else if (result.length > 0) {
            result = result[0]
            result.answers = JSON.parse(result.answers)

            result.public = !!result.public

            res.render('poll', result)
        } else {
            res.status(404).render('error', { error: 'No poll with this id' })
        }
    })
}
