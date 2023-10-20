const router = require('express').Router();
const smsRoutes = require('./sms');
const dashboardRoutes = require('./dashboard');

router.use('/sms', smsRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;