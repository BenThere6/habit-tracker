const router = require('express').Router();

app.post('/handleSmsReply', (req, res) => {
    const textId = req.body.textId;
    const fromNumber = req.body.fromNumber;
    const text = req.body.text;

    console.log(`Received SMS reply from ${fromNumber}: ${text}`);

    res.sendStatus(200);
});

module.exports = router;