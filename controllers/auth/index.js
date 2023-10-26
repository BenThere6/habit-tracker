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
        return res.status(400).json({ error: 'Email is required' });
    }

    // Use the User model to find the user by email
    User.findOne({ where: { email } }).then(user => {
        if (!user) {
            // User not found, handle this case
            return res.status(400).json({ error: 'Email or password is incorrect' });
        }

        if (!user.checkPassword(password)) {
            // Password is incorrect, handle this case
            return res.status(400).json({ error: 'Email or password is incorrect' });
        }

        // Set up the user session after successful login
        req.login(user, err => {
            if (err) {
                return next(err);
            }
            res.status(200).send('OK');
            return;
        });
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/');
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
            return res.status(400).json({ error: 'Email is already in use' });
        } else if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' })
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
                        res.status(200).send('OK');
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