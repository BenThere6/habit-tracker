const router = require('express').Router();
const smsRoutes = require('./sms');
const dashboardRoute = require('./dashboard');
const loginRoute = require('./auth/login');
const registerRoute = require('./auth/register');
const { ensureAuthenticated } = require('./auth/authMiddleware'); 

router.use('/dashboard', ensureAuthenticated, dashboardRoute);
router.use('/sms', smsRoutes);
router.use('/login', loginRoute);
router.use('/register', registerRoute);

module.exports = router;