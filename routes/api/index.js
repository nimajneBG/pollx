const express = require('express')
const router = express.Router()

const api = require('./functions')


// GET Poll results
router.get('/results/:id', api.getResults)

// GET Random polls for preview
router.get('/random/:max?', api.getRandomPolls)

// POST Vote
router.post('/vote/:id', api.vote)

// POST Create poll
router.post('/create-poll', api.createPoll)



module.exports = router
