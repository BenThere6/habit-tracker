const router = require('express').Router();
const path = require('path');
const { ensureAuthenticated } = require('./auth/authMiddleware'); 

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    console.log('Rendering dashboard');
    console.log('I am not lying to you')
    // res.json({message: "i hate everything"})
    res.render('dashboard');
    // const filePath = path.join(__dirname, '../public/html/dashboard.html');
    // res.sendFile(filePath, (err) => {
    //     if (err) {
    //         console.error(err);
    //         res.status(500).send('Error serving page.');
    //     }
    // });
});

router.get('/', (req,res) => {
    const filePath = path.join(__dirname, '../public/html/index.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error serving page.');
        }
    });
});

module.exports = router;