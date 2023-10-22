const router = require('express').Router();
const path = require('path');
const { ensureAuthenticated } = require('./auth/authMiddleware'); 

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard');
});

router.get('/', (req,res) => {
    const filePath = path.join(__dirname, '../public/html/index.html');
    res.sendFile(filePath);
})

module.exports = router;