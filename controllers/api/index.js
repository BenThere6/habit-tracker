const router = require('express').Router();
const smsRoutes = require('./sms');
const dashboardRoute = require('./dashboard');
const { ensureAuthenticated } = require('./controllers/authMiddleware');

router.use('/dashboard', ensureAuthenticated, dashboardRoute);
router.use('/sms', smsRoutes);

module.exports = router;