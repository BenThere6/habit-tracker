const router = require('express').Router();
const { ensureAuthenticated } = require('../middleware/authMiddleware'); 

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard');
});

router.get('/journal', ensureAuthenticated, (req, res) => {
    res.render('journal');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

router.get('/settings', ensureAuthenticated, (req, res) => {
    res.render('settings');
});

router.get('/', (req,res) => {
    res.render('landing')
});

module.exports = router;