const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const ensureAuthenticated = require("../helpers/auth");
const Booking = require('../models/Booking');
const Classes = require('../models/Class');
const Bookings = require('../models/Booking');

// BOOKING SESSION
//booking id, course id, class id, user id, date created

//book will be listBooking
router.get('/listBooking', ensureAuthenticated, (req, res) => {
    Classes.findAll({
            where: { userId: req.user.id },
            raw: true
        })
        .then((classes) => {
            res.render('booking/listBooking', { classes });
        })
        .catch(err => console.log(err));
});

router.get('/listBooking', ensureAuthenticated, (req, res) => {
    Booking.findAll({
            where: { userId: req.user.id },
            raw: true
        })
        .then((classes) => {
            res.render('booking/listBooking', { classes });
        })
        .catch(err => console.log(err));
});


router.get('/checkout', ensureAuthenticated, (req, res) => {
    Classes.findAll({
            where: { userId: req.user.id },
            raw: true
        })
        .then((classes) => {
            res.render('booking/checkout', { classes });
        })
        .catch(err => console.log(err));
});

router.get('/confirm', ensureAuthenticated, (req, res) => {
    Classes.findAll({
            where: { userId: req.user.id },
            raw: true
        })
        .then((classes) => {
            res.render('booking/confirm', { classes });
        })
        .catch(err => console.log(err));
});

router.get('/payment', (req, res) => {
    Classes.findAll({
        where: { userId: req.user.id },
        raw: true
    })
    .then((classes) => {
        res.render('booking/payment', { classes });
    })
    .catch(err => console.log(err));
});

router.get('/successful', (req, res) => {
    Classes.findAll({
        where: { userId: req.user.id },
        raw: true
    })
    .then((classes) => {
        res.render('booking/successful', { classes });
    })
    .catch(err => console.log(err));
});

router.get('/search', (req, res) => {
    res.render('booking/search');
});

router.get('/addbookdb', ensureAuthenticated, (req, res) => {
    res.render('booking/addbookdb');
});

router.post('/addbookdb', ensureAuthenticated, (req, res) => {
    let course_id = req.body.course_id;
    let class_id = req.body.class_id;
    let userId = req.user.id;

    Booking.create(
        { course_id, class_id, userId}
    )
        .then((booking) => {
            console.log(booking.toJSON());
            res.redirect('/booking/listbookdb');
        })
        .catch(err => console.log(err))
});

router.get('/listbookdb', (req, res) => {
    Booking.findAll({
        where: { userId: req.user.id },
        raw: true
    })
    .then((booking) => {
        res.render('booking/listbookdb', { booking });
    })
    .catch(err => console.log(err));
});
module.exports = router;