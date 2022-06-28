const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const ensureAuthenticated = require("../helpers/auth");
const Booking = require('../models/Booking');

// BOOKING SESSION
//book will be listBooking
router.get('/listBooking', ensureAuthenticated, (req, res) => {
    Booking.findAll({
            where: { userId: req.user.id },
            raw: true
        })
        .then((booking) => {
            res.render('booking/listBooking', { booking });
        })
        .catch(err => console.log(err));
});

router.get('/addBooking', ensureAuthenticated, (req, res) => {
    res.render('booking/addBooking');
});

router.post('/addBooking', ensureAuthenticated, (req, res) => {
    let name = req.body.name.toString();
    let course_id = req.body.course_id;
    let class_id = req.body.class_id;
    let difficulty = req.body.difficulty.toString();
    let price = req.body.price;
    // let date = req.body.date;
    let time = req.body.time;
    let instructor_id = req.body.instructor_id;
    let instructor_name = req.body.instructor_name;
    let userId = req.user.id;

    Booking.create(
        { name, course_id, class_id, difficulty, price, time, instructor_id, instructor_name, userId}
    )
        .then((booking) => {
            console.log(booking.toJSON());
            res.redirect('/booking/listBooking');
        })
        .catch(err => console.log(err))
});

router.get('/checkout', (req, res) => {
    res.render('booking/checkout');
});

router.get('/confirm', (req, res) => {
    res.render('booking/confirm');
});

router.get('/payment', (req, res) => {
    res.render('booking/payment');
});

router.get('/successful', (req, res) => {
    res.render('booking/successful');
});

// router.get('/search', (req, res) => {
//     res.render('booking/search');
// });

module.exports = router;