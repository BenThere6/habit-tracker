const router = require('express').Router();
const apiRouter = require('./api');
const authRouter = require('./auth');
const homeRoutes = require('./homeRoutes');

router.use('/api', apiRouter);
router.use('/auth', authRouter);
router.use('/', homeRoutes);

module.exports = router;