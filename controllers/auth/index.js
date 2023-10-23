const router = require('express').Router();
const { User } = require('../../models');
const path = require('path');

router.get('/login', (req, res) => {
    const filePath = path.join(__dirname, '../../public/html/login.html');
    res.sendFile(filePath);
});

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;

    if (!email) {
        // Handle the case where email is not provided
        return res.redirect('/auth/login');
    }

    // Use the User model to find the user by email
    User.findOne({ where: { email } }).then(user => {
        if (!user) {
            // User not found, handle this case
            return res.redirect('/auth/login');
        }

        if (!user.checkPassword(password)) {
            // Password is incorrect, handle this case
            return res.redirect('/auth/login');
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
            res.redirect('/auth/register');
            console.log('User already exists.')
        } else {
            // Create a new user
            User.create({ email, password })
                .then(user => {
                    console.log('New user has been created.')
                    // Log the user in after registration
                    req.login(user, err => {
                        if (err) {
                            console.log('Error logging in new user.')
                            return next(err);
                        }
                        console.log('Redirecting new user to dashboard.')
                        res.redirect('/dashboard');
                    });
                })
                .catch(err => {
                    console.log('Registration failed.')
                    res.render('register', { message: 'Registration failed' });
                });
        }
    });
});

module.exports = router;