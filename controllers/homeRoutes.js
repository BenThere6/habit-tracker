const router = require('express').Router();

router.get('/', (req,res) => {
    res.sendFile(__dirname + '/views/index.html');
})

module.exports = router;