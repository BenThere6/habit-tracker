const router = require('express').Router();
const apiRouter = require('./api');
const homeRoutes = require('./homeRoutes');

router.use('/', homeRoutes);
router.use('/api', apiRouter);

module.exports = router;