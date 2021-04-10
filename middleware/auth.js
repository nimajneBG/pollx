// Check whether a user isn't logged in and send him to the login page
exports.redirectLogin = (req, res, next) => {
    if (!req.session.userID) {
        res.redirect('/login')
    } else {
        next()
    }
}

// Check whether a user is already logged in and send him to his dashboard
exports.redirectDashboard = (req, res, next) => {
    if (req.session.userID) {
        res.redirect('/dashboard')
    } else {
        next()
    }
}
