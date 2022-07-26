const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const ensureAuthenticated = require("../helpers/auth");
const Booking = require('../models/Booking');
const Cart = require('../models/Cart');
const Class = require('../models/Class');
const Course = require('../models/Course');
const User = require('../models/User');


router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin'; // set your layout here
    next(); // pass control to the next handler
});

router.get('/', (req, res) => {
    Booking.findAll({
        raw: true
    })
        .then((classes) => {
            // pass object to listVideos.handlebar
            res.render('booking/listBooking', { booking });
        })
        .catch(err => console.log(err));
});

// BOOKING SESSION
//booking id, course id, class id, user id, date created

//book will be listBooking
router.get('/listBooking', ensureAuthenticated, async (req, res) => {
    const booking = await Booking.findAll({ 
        include: [
            {model:Cart, attributes:['id']},
            {model:Class, attributes:['id']},
            {model:Course, attributes:['id']},
            {model:User, attributes:['id']}   
        ]
    });
    res.render('booking/listBooking', { booking });
});


router.get('/addBooking', ensureAuthenticated, (req, res) => {
    res.render('booking/addBooking');
});

router.post('/addBooking', ensureAuthenticated, (req, res) => {
    let course_id = req.body.course_id;
    let class_id = req.body.class_id;
    // Use Video.create({}) to insert a record into the booking table, using the current course's courseId which is retrieved from req.course.id.
    let courseId = req.course.id;
    // Use Video.create({}) to insert a record into the booking table, using the current user’s userId which is retrieved from req.user.id.
    let userId = req.user.id;

    Booking.create(
        { course_id, class_id, courseId, userId}
    )
        .then((booking) => {
            console.log(booking.toJSON());
            res.redirect('/booking/listBooking');
        })
        .catch(err => console.log(err))
});


router.get('/editBooking/:id', ensureAuthenticated, (req, res) => {
    Booking.findByPk(req.params.id)
        .then((booking) => {
            if (!booking) {
                flashMessage(res, 'error', 'Booking not found');
                res.redirect('/booking/listBooking');
                return;
            }
            res.render('booking/editBooking', { booking });
        })
        .catch(err => console.log(err));
});

router.post('/editBooking/:id', ensureAuthenticated, (req, res) => {
    let course_id = req.body.course_id;
    let class_id = req.body.class_id;

    Booking.update(
        { course_id, class_id },
        { where: { id: req.params.id } }
    )
        .then((result) => {
            console.log(result[0] + ' booking updated');
            res.redirect('/booking/listBooking');
        })
        .catch(err => console.log(err));
});

router.get('/deleteBooking/:id', ensureAuthenticated, async function (req, res) {
    try {
        let booking = await Booking.findByPk(req.params.id);
        if (!booking) {
            flashMessage(res, 'error', 'Booking not found');
            res.redirect('/booking/listBooking');
            return;
        }
        let result = await booking.destroy({ where: { id: booking.id } });
        console.log(result + ' booking deleted');
        res.redirect('/booking/listBooking');
    }
    catch (err) {
        console.log(err);
    }
});

router.get('/checkout', ensureAuthenticated, (req, res) => {
    Booking.findAll({
            // where: { userId: req.user.id },
            raw: true
        })
        .then((booking) => {
            res.render('booking/checkout', { booking });
        })
        .catch(err => console.log(err));
});

router.get('/confirm', ensureAuthenticated, (req, res) => {
    Booking.findAll({
            // where: { userId: req.user.id },
            raw: true
        })
        .then((booking) => {
            res.render('booking/confirm', { booking });
        })
        .catch(err => console.log(err));
});

router.get('/payment', (req, res) => {
    Booking.findAll({
        // where: { userId: req.user.id },
        raw: true
    })
    .then((booking) => {
        res.render('booking/payment', { booking });
    })
    .catch(err => console.log(err));
});

router.get('/successful', (req, res) => {
    Booking.findAll({
        // where: { userId: req.user.id },
        raw: true
    })
    .then((booking) => {
        res.render('booking/successful', { booking });
    })
    .catch(err => console.log(err));
});

module.exports = router;