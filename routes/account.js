const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Class = require('../models/Class');
const Course = require('../models/Course');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const ensureAuthenticated = require('../helpers/auth');
const randtoken = require('rand-token');
const nodemailer = require("nodemailer");
const Review = require('../models/Review');

function sendEmail(email, token) {
    var email = email;
    var token = token;
    let mail = nodemailer.createTransport({
        // service: 'gmail',
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: 'skylarhiyagaming@gmail.com', // Your email id
            pass: 'xpsuaskucepikgoe' // Your password
        }
    });
    var mailOptions = {
        from: 'skylarhiyagaming@gmail.com',
        to: email,
        subject: 'Reset Password Link - Ginseng and stitch',
        html: '<p>You requested for reset password, kindly use this <a href="http://localhost:5000/account/resetPassword?token=' + token + '">link</a> to reset your password</p>'
    };
    mail.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log(info)
        }
    });
}
/* home page */
router.get('/', ensureAuthenticated, async (req, res) => {
    const bookings = await Booking.findAll({ where: { userId: req.user.id }, include: [{ model: Class }, { model: Course }] });

    res.render('account/account', { bookings })
});

router.get('/login', (req, res) => {
    res.render('account/login');
});

router.get('/register', (req, res) => {
    res.render('account/register');
});

router.post('/register', async function (req, res) {
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

            let user = await User.create({ name, email, password: hash });
            flashMessage(res, 'success', email + ' registered successfully');
            res.redirect('/account/login');
        }
    } catch (err) {
        console.log(err);
    }
});

router.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/account/login',
        failureFlash: true,
    }), (req, res) => {
        if (req.user.role === 'a') {
            console.log(req.user)
            res.redirect('/admin');
        }
        else if (req.user.role === 'u') {
            console.log(req.user)
            res.redirect('/account');
        }
    });

router.get('/resetEmail', (req, res) => {
    res.render('account/sendEmail');
});

router.post('/sendEmail', async function (req, res) {
    var email = req.body.email;
    console.log(email);
    try {
        const user = await User.findOne({ where: { email: email } })
        if (!user) {
            flashMessage(res, 'error', 'The Email is not registered with us');
            res.redirect('/account/register')
        }
        else {
            var token = randtoken.generate(20);
            var sent = sendEmail(email, token);
            console.log(sent + " " + token)
            user.update({ token: token });
            flashMessage(res, 'success', 'Email sent');
            res.redirect('/');
        }
    }
    catch (err) {
        console.log(err);
    }
});
router.get('/resetPassword', function (req, res, next) {
    // console.log(req.query.token)
    res.render('account/resetPassword');
});

router.post('/resetPassword', async function (req, res, next) {
    var token = req.query.token
    console.log(token + " token")
    var password = req.body.password;
    var password2 = req.body.password2;
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
        console.log("valid false")
        flashMessage(res, 'error', 'Unable to reset password, please try again.');
        return;
    }
    try {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        // If all is well, checks if user is already registered
        let check = await User.findOne({ where: { token: token } });
        if (!check) {
            // If user is found, that means email has already been registered
            console.log("check false")
            flashMessage(res, 'error', ' Unable to reset password, please try again.');
            res.redirect('/account/login')
        } else {
            // Create new user record 
            // Use hashed password
            User.update({ password: hash }, { where: { token: token } })
                .then((result) => {
                    console.log(result[0] + ' account updated');
                    flashMessage(res, 'success', ' Password changed successfully!');
                    res.redirect('/account/login');
                })
                .catch(err => console.log(err));
        }
    } catch (err) {
        console.log(err);
    }

})

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
        console.log("User logged out successfully");
        flashMessage(res, 'success', ' logged out successfully');
    });
});

router.post('/editUser/:id', ensureAuthenticated, (req, res) => {
    console.log(JSON.stringify(req.body));
    let name = req.body.name;
    let email = req.body.email;
    console.log(name);
    console.log(email);
    User.update({ name, email }, { where: { id: req.params.id } })
        .then((result) => {
            console.log(result[0] + ' account updated');
            res.redirect('/account');
        })
        .catch(err => console.log(err));
});

router.post('/changePassword/:id', ensureAuthenticated, async (req, res) => {
    console.log("L")
    let { newPassword, newPassword2 } = req.body;
    let isValid = true;
    if (newPassword.length < 6) {
        flashMessage(res, 'error', 'Password must be at least 6 characters');
        isValid = false;
    }
    if (newPassword != newPassword2) {
        flashMessage(res, 'error', 'Passwords do not match');
        isValid = false;
    }
    if (!isValid) {
        res.redirect('/account');
        return;
    }
    try {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(newPassword, salt);
        // If all is well, checks if user is already registered
        let check = await User.findOne({ where: { password: hash } });
        if (check) {
            // If user is found, that means email has already been registered
            flashMessage(res, 'error', ' current password is wrong');
            res.redirect('/account')
        } else {
            // Create new user record 
            // Use hashed password
            User.update({ password: hash }, { where: { id: req.params.id } })
                .then((result) => {
                    console.log(result[0] + ' account updated');
                    flashMessage(res, 'success', ' Password changed successfully!');
                    res.redirect('/account');
                })
                .catch(err => console.log(err));
        }
    } catch (err) {
        console.log(err);
    }

});

router.get('/review/:id', async (req, res) => {
    const booking = await Booking.findOne({
        include: [
            { model: Class },
            { model: User },
            { model: Course }
        ],
        where :
        {
            id: req.params.id
        }
    });


    const user = booking.User;
    const course = booking.Course;

    res.render('account/review', { user , course });
});

router.post('/review/:id', async function (req, res){
    let { rate, review } = req.body;
    
    const star_count = rate;

    const booking = await Booking.findOne({
        include: [
            { model: Class },
            { model: User },
            { model: Course }
        ],
        where :
        {
            id: req.params.id
        }
    });

    console.log(booking);

    const CourseId = booking.CourseId;
    const UserId = booking.UserId;

    Review.create(
        { star_count, review, CourseId, UserId }
    )
    .then((review) =>{
        console.log('Review sent');
        flashMessage(res, 'success', ' Review sent successfully');
        res.redirect('/account');
    });
});




module.exports = router;