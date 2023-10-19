const router = require('express').Router();
const smsRoutes = require('./sms');

router.use('/sms', smsRoutes);

module.exports = router;