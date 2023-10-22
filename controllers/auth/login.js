const express = require('express');
const router = express.Router();
const { User } = require('../../models');
const path = require('path');

router.get('/', (req, res) => {
    const filePath = path.join(__dirname, '../../../public/html/login.html');
    res.sendFile(filePath);
});

router.post('/', (req, res, next) => {
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

module.exports = router;