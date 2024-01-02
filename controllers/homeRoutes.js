const router = require('express').Router();
const { ensureAuthenticated } = require('../middleware/authMiddleware'); 

router.get('/settings', ensureAuthenticated, (req, res) => {
    res.render('settings');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard');
});

router.get('/', (req,res) => {
    res.render('landing')
});

module.exports = router;