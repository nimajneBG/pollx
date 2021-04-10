const express = require('express')
const router = express.Router()

const auth = require('../../middleware/auth')
const pages = require('./functions')


// GET Home
router.get('/', pages.home)

// GET Poll
router.get('/poll/:id', pages.poll)

// GET Create poll
router.get('/create-poll', auth.redirectLogin, pages.createPoll)

// GET Search
router.get('/search', pages.search)

// GET & POST Login
router.route('/login')
    .get(auth.redirectDashboard, pages.loginGet)
    .post(auth.redirectDashboard, pages.loginPost)

// GET & POST Register
router.route('/register')
    .get(auth.redirectDashboard, pages.registerGet)
    .post(auth.redirectDashboard, pages.registerPost)

// GET Logout
router.get('/logout', auth.redirectLogin, pages.logout)

// GET Dashboard (Home for logged in users)
router.get('/dashboard', auth.redirectLogin, pages.dashboard)

module.exports = router
