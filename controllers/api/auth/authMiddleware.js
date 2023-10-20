function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // User is authenticated, proceed to the next middleware or route.
    }
    // User is not authenticated, redirect to the login page or send an error response.
    res.redirect('/api/auth/login'); // You can customize this to match your login route.
}

module.exports = { ensureAuthenticated };