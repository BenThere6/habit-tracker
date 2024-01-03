const router = require('express').Router();
const habitRoutes = require('./habit');
const journalRoutes = require('./journal');
const { ensureAuthenticated } = require('../../middleware/authMiddleware');

router.use('/habit', ensureAuthenticated, habitRoutes);

router.use('/journal', ensureAuthenticated, habitRoutes);

router.post('/handleSmsReply', (req, res) => {
    const textId = req.body.textId;
    const fromNumber = req.body.fromNumber;
    const text = req.body.text;

    console.log(`Received SMS reply from ${fromNumber}: ${text}`);

    res.sendStatus(200);
});

module.exports = router;