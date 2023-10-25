const router = require('express').Router();
const habitRoutes = require('./habit');

router.use('/habit', habitRoutes);

router.post('/handleSmsReply', (req, res) => {
    const textId = req.body.textId;
    const fromNumber = req.body.fromNumber;
    const text = req.body.text;

    console.log(`Received SMS reply from ${fromNumber}: ${text}`);

    res.sendStatus(200);
});

module.exports = router;