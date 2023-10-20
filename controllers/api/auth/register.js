const express = require('express');
const router = express.Router();
const { User } = require('../../../models');

// GET request to display the registration form
router.get('/register', (req, res) => {
    // Render your registration form page
    res.render('register');
});

// POST request to handle user registration
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
                        // Redirect to the user's dashboard
                        res.redirect('/dashboard');
                    });
                })
                .catch(err => {
                    // Handle the registration error
                    res.render('register', { message: 'Registration failed' });
                });
        }
    });
});

module.exports = router;