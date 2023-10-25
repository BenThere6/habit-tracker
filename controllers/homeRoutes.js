const router = require('express').Router();
const { ensureAuthenticated } = require('../middleware/authMiddleware'); 

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    console.log('Rendering dashboard')
    res.render('dashboard');
});

router.get('/', (req,res) => {
    res.render('landing')
});

module.exports = router;