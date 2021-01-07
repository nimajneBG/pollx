const express = require('express')
const path = require('path')
const router = express.Router()

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/src/index.html'))
})

// GET Poll
router.get('/poll/:id', (req, res) => {
    res.sendFile(path.join(__dirname + '/src/poll.html'))
})

// GET Create poll
router.get('/create-poll', (req, res) => {
    res.sendFile(path.join(__dirname + '/src/create-poll.html'))
})

module.exports = router
