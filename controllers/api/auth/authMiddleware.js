function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        // User is authenticated, proceed to the next middleware or route.
        return next();
    }
    // User is not authenticated, redirect to the login page or send an error response.
    res.redirect('/api/auth/login');
}

module.exports = { ensureAuthenticated };