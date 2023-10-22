const router = require('express').Router();
const { User } = require('../../models');
const path = require('path');

router.get('/login', (req, res) => {
    const filePath = path.join(__dirname, '../../public/html/login.html');
    res.sendFile(filePath);
});

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;

    // Use the User model to find the user by email
    User.findOne({ where: { email } }).then(user => {
        if (!user) {
            // User not found, handle this case
            return res.redirect('/api/login');
        }

        if (!user.checkPassword(password)) {
            // Password is incorrect, handle this case
            return res.redirect('/api/login');
        }

        // Set up the user session after successful login
        req.login(user, err => {
            if (err) {
                return next(err);
            }
            return res.redirect('/dashboard');
        });
    });
});

router.get('/register', (req, res) => {
    const filePath = path.join(__dirname, '../../public/html/register.html');
    res.sendFile(filePath);
});

router.post('/register', (req, res, next) => {
    const { email, password } = req.body;

    // Check if the email is already in use
    User.findOne({ where: { email } }).then(user => {
        if (user) {
            // Email is already in use, handle this case
            res.redirect('/api/auth/register');
        } else {
            // Create a new user
            User.create({ email, password })
                .then(user => {
                    // Log the user in after registration
                    req.login(user, err => {
                        if (err) {
                            return next(err);
                        }
                        res.redirect('/dashboard');
                    });
                })
                .catch(err => {
                    res.render('register', { message: 'Registration failed' });
                });
        }
    });
});

module.exports = router;