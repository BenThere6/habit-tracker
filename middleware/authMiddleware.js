function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        // User is authenticated, proceed to the next middleware or route.
        console.log('User is authenticated.')
        return next();
    }
    // User is not authenticated, redirect to the login page or send an error response.
    console.log('User is not authenticated.')
    res.redirect('/auth/login');
}

module.exports = { ensureAuthenticated };