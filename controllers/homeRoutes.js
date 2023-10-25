const router = require('express').Router();
const path = require('path');
const { ensureAuthenticated } = require('./auth/authMiddleware'); 

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard');
});

router.get('/', (req,res) => {
    res.render('landing')
});

module.exports = router;