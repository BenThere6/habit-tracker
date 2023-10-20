const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('../../views/dashboard');
});

module.exports = router;