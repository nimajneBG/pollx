const express = require('express')
const router = express.Router()

const pages = require('./functions')


// GET Home
router.get('/', pages.home)

// GET Poll
router.get('/poll/:id', pages.poll)

// GET Create poll
router.get('/create-poll', pages.createPoll)

module.exports = router
