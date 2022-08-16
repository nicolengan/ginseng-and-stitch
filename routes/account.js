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
const sendEmail = require('../helpers/sendEmail');
const validateDetails = require('../helpers/validateDetails');
const randtoken = require('rand-token');
const Review = require('../models/Review');
const validator = require("email-validator");

/* home page */
router.get('/', ensureAuthenticated, async (req, res) => {
    const bookings = await Booking.findAll({ where: { userId: req.user.id }, include: [{ model: Class }, { model: Course }] });
    res.render('account/account', { bookings })
});

router.get('/bookings', async (req, res) => {
    const bookings = await Booking.findAll({ where: { userId: req.user.id }, include: [{ model: Class }, { model: Course }] });
    res.render('account/bookings', { bookings })
});

router.get('/bookings', async (req, res) => {
    const bookings = await Booking.findAll({ where: { userId: req.user.id }, include: [{ model: Class }, { model: Course }] });
    res.render('account/bookings', { bookings })
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
    isValid = validateDetails(res, isValid, password, password2, email)
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

            let user = await User.create({ name: name, email: email, password: hash });
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
            var subject = 'Reset Password Link - Ginseng and stitch';
            var message = '<p>You requested for reset password, kindly use this <a href="http://localhost:5000/account/resetPassword?token=' + token + '">link</a> to reset your password</p>';
            var sent = sendEmail(email, subject, message);
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
    isValid = validateDetails(res, isValid, password, password2)
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
    let birthday = req.body.birthday;
    if (birthday.length == 0)
    {
        birthday = null
    }
    let gender = req.body.gender;
    User.update({ name: name, email:email, birthday: birthday, gender: gender }, { where: { id: req.params.id } })
        .then((result) => {
            console.log(result);
            res.redirect('/account');
        })
        .catch(err => console.log(err));
});
router.get('/changePassword', function (req, res, next) {
    // console.log(req.query.token)
    res.render('account/changePassword');
});
router.get('/changePassword', function (req, res, next) {
    // console.log(req.query.token)
    res.render('account/changePassword');
});

router.post('/changePassword/:id', ensureAuthenticated, async (req, res) => {
    let { oldPassword, newPassword, newPassword2 } = req.body;
    console.log(oldPassword)
    let isValid = true;
    isValid = validateDetails(res, isValid, newPassword, newPassword2)
    if (!isValid) {
        res.redirect('/account/changePassword');
        return;
    }
    try {
        // If all is well, checks if user is already registered
        check = bcrypt.compareSync(oldPassword, req.user.password);
        console.log(check)
        if (!check) {
            // If user is found, that means email has already been registered
            flashMessage(res, 'error', ' Old password is wrong');
            res.redirect('/account/changePassword')
        } else {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(newPassword, salt);
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(newPassword, salt);
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
    const review = await Booking.findOne({
        include: [
            { model: Course }
        ],
        where :
        {
            id: req.params.id
        }
    });
    console.log(review)

    res.render('account/review', { review });
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