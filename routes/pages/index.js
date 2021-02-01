const express = require('express')
const router = express.Router()

const pages = require('./functions')


// GET Home
router.get('/', (req, res) => {
    res.render('index', {test: 'Das ist ein Test'})
})

// GET Poll
router.get('/poll/:id', pages.poll)

// GET Create poll
router.get('/create-poll', (req, res) => {
    res.render('create-poll')
})

module.exports = router
