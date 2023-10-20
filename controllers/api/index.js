const router = require('express').Router();
const smsRoutes = require('./sms');
const dashboardRoutes = require('./dashboard');

const { ensureAuthenticated } = require('./controllers/authMiddleware');
const dashboardRoute = require('./controllers/api/dashboard');

router.use('/dashboard', ensureAuthenticated, dashboardRoute);
router.use('/sms', smsRoutes);

module.exports = router;