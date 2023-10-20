const router = require('express').Router();

router.get('/register', (req, res) => {
    res.sendFile(__dirname + '/views/register.html');
})

module.exports = router;