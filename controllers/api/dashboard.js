const router = require('express').Router();

router.get('/', (req, res) => {
    // Render your dashboard page here.
    res.render('dashboard'); // Customize this to match your dashboard view.
});

module.exports = router;