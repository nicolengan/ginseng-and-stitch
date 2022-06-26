const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const crypto = require('crypto');
const ensureAuthenticated = require('../helpers/auth');
const isAdmin = require('../helpers/admin');

router.get('/', ensureAuthenticated, (req, res) => {
    User.findAll({
            where: { uuid: req.user.uuid },
            raw: true
        })
        .then((users) => {
            res.render('account/account', { users });
        })
        .catch(err => console.log(err));
});

router.get('/login', (req, res) => {
    res.render('account/login');
});

router.get('/register', (req, res) => {
    res.render('account/register');
});

router.post('/register', async function(req, res) {
    let { name, email, password, password2 } = req.body;

    let isValid = true;
    if (password.length < 6) {
        flashMessage(res, 'error', 'Password must be at least 6 characters');
        isValid = false;
    }
    if (password != password2) {
        flashMessage(res, 'error', 'Passwords do not match');
        isValid = false;
    }
    if (!isValid) {
        res.render('account/register', {
            name,
            email
        });
        return;
    }

    try {
        // If all is well, checks if user is already registered
        let user = await User.findOne({ where: { email: email } });
        if (user) {
            // If user is found, that means email has already been registered
            flashMessage(res, 'error', email + ' already registered');
            res.render('account/register', {
                name,
                email
            });
        } else {
            // Create new user record 
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            // Use hashed password
            var uuid = crypto.randomUUID();
            console.log(uuid)
            let user = await User.create({ name, uuid, email, password: hash, role: "admin" });
            flashMessage(res, 'success', email + ' registered successfully');
            res.redirect('/account/login');
        }
    } catch (err) {
        console.log(err);
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        // Success redirect URL
        successRedirect: '/account',
        // Failure redirect URL 
        failureRedirect: '/account/login',
        /* Setting the failureFlash option to true instructs Passport to flash 
        an error message using the message given by the strategy's verify callback.
        When a failure occur passport passes the message object as error */
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
        console.log("User logged out successfully");
    });
});

router.get('/test', isAdmin, (req, res) => {
    res.redirect('/');
});
module.exports = router;