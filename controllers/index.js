const router = require('express').Router();
const apiRouter = require('./api');
const authRouter = require('./auth');
const homeRoutes = require('./homeRoutes');
const { sendEmail } = require('../utils/sendEmail');

router.use('/api', apiRouter);
router.use('/auth', authRouter);

router.post('/submit-message', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        await sendEmail(process.env.EMAIL, 'New Contact Form Submission', `Name: ${name}\nEmail: ${email}\nMessage: ${message}`);
        console.log('Email sent successfully');
        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// router.get('/submit-message', (req, res) => {
//     res.render('contact')
// })

router.use('/', homeRoutes);
router.use((req,res) => {res.render('page-not-found')})

module.exports = router;