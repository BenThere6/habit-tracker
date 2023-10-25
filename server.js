const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');
const { sendSMS } = require('./utils/sendSms');
const bodyParser = require('body-parser');
const controllers = require('./controllers');
const { User } = require('./models');
const { engine } = require('express-handlebars')
const crypto = require('crypto');
const { clog } = require('./middleware/clog')
const sessionSecret = crypto.randomBytes(32).toString('hex');

const app = express();

app.use(clog)
app.use(bodyParser.json());
app.use(session({ secret: sessionSecret, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views')
app.use(express.static('public'));
app.use(controllers);

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, (email, password, done) => {
    User.findOne({ where: { email } }).then(user => {
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        if (!user.checkPassword(password)) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findByPk(id).then(user => {
        done(null, user);
    });
});

port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});