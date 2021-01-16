const express = require('express')
const router = express.Router()

const api = require('../api')


// GET Poll data
router.get('/poll/:id', api.getPollData)

// GET Poll results
router.get('/results/:id', api.getResults)

// POST Vote
router.post('/vote/:id', api.vote)

// POST Create poll
router.post('/create-poll', api.createPoll)



module.exports = router