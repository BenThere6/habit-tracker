const router = require('express').Router();

router.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/dashboard.html');
})

module.exports = router;