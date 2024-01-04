const router = require('express').Router();
const habitRoutes = require('./habit');
const journalRoutes = require('./journal');
const { ensureAuthenticated } = require('../../middleware/authMiddleware');

router.use('/journal', ensureAuthenticated, journalRoutes);
router.use('/habit', ensureAuthenticated, habitRoutes);

router.post('/handleSmsReply', (req, res) => {
    const textId = req.body.textId;
    const fromNumber = req.body.fromNumber;
    const text = req.body.text;

    console.log(`Received SMS reply from ${fromNumber}: ${text}`);

    res.sendStatus(200);
});

router.get('/currentUserId', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ userId: req.user.id });
    } else {
        res.status(401).json({ error: 'User not authenticated' });
    }
});

module.exports = router;