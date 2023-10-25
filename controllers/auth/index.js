const router = require('express').Router();
const { User } = require('../../models');

router.get('/login', (req, res) => {
    res.render('login')
});

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;

    if (!email) {
        // Handle the case where email is not provided
        console.log('Email not provided.')
        return res.redirect('/auth/login');
    }

    // Use the User model to find the user by email
    User.findOne({ where: { email } }).then(user => {
        if (!user) {
            // User not found, handle this case
            console.log('User not found.')
            return res.redirect('/auth/login');
        }

        if (!user.checkPassword(password)) {
            // Password is incorrect, handle this case
            console.log('Incorrect password.')
            return res.redirect('/auth/login');
        }

        // Set up the user session after successful login
        req.login(user, err => {
            if (err) {
                return next(err);
            }
            console.log('Successful login, redirecting to /dashboard.')
            res.redirect(303, '/dashboard');
            return;
        });
    });
});

router.get('/register', (req, res) => {
    res.render('register')
});

router.post('/register', (req, res, next) => {
    const { email, password } = req.body;

    // Check if the email is already in use
    User.findOne({ where: { email } }).then(user => {
        if (user) {
            // Email is already in use, handle this case
            console.log('User already exists.')
            res.redirect('/auth/register');
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