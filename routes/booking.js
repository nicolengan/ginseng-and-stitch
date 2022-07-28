const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const ensureAuthenticated = require("../helpers/auth");
const Booking = require('../models/Booking');
const Class = require('../models/Class');
const Course = require('../models/Course');

router.get('/api/list', async (req, res) => {
    return res.json({
        total: await Booking.count(),
        rows: await Booking.findAll({
            include: [
                { model: Class },
                { model: Course }
            ]
        })
    })
});

// BOOKING SESSION
//booking id, course id, class id, user id, date created

//book will be listBooking
router.get('/listBooking', ensureAuthenticated, async (req, res) => {
    const booking = await Booking.findAll({
        include: [
            { model: Class },
            { model: Course }
        ]
    });
    res.render('booking/listBooking', { booking });
});


router.get('/addBooking', ensureAuthenticated, async (req, res) => {
    const booking = await Booking.findAll({
        include: [
            { model: Class, attributes: ['id'] },
            { model: Course }
        ]
    });
    const courses = await Course.findAll();
    const classes = await Class.findAll();
    res.render('booking/addBooking', { booking, courses, classes });
});

router.post('/addBooking', ensureAuthenticated, async (req, res) => {
    let CourseId = req.body.CourseId;
    let ClassId = req.body.ClassId;
    let UserId = req.user.id

    Booking.create(
        { CourseId, ClassId, UserId }
    )
        .then((classes) => {
            console.log(classes.toJSON());
            res.redirect('/booking/listBooking');
        })
        .catch(err => console.log(err))
});

router.get('/editBooking/:id', ensureAuthenticated, async (req, res) => {
    var booking = Booking.findByPk(req.params.id, {
        include: [
            { model: Class },
            { model: Course }
        ]
    })
    const courses = await Course.findAll();
    const classes = await Class.findAll();
    res.render('booking/editBooking', { booking, courses, classes });
});

router.post('/editBooking/:id', ensureAuthenticated, (req, res) => {
    let CourseId = req.body.CourseId;
    let ClassId = req.body.ClassId;

    Booking.update(
        { CourseId, ClassId },
        { where: { id: req.params.id } }
    )
        .then((result) => {
            console.log(result[0] + ' booking updated');
            res.redirect('/booking/listBooking');
        })
        .catch(err => console.log(err))
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
        res.redirect('/account');
    }
    catch (err) {
        console.log(err);
    }
});

router.get('/checkout', async (req, res) => {
    const booking = await Booking.findAll({
        include: [
            { model: Class },
            { model: Course }
        ]
    });
    const courses = await Course.findAll();
    const classes = await Class.findAll();
    res.render('booking/checkout', { booking, courses, classes });
});

router.get('/confirm', async (req, res) => {
    const booking = await Booking.findAll({
        include: [
            { model: Class },
            { model: Course }
        ]
    });
    const courses = await Course.findAll();
    const classes = await Class.findAll();
    res.render('booking/confirm', { booking, courses, classes });
});

// router.get('/payment', (req, res) => {
//     Booking.findAll({
//         // where: { userId: req.user.id },
//         raw: true
//     })
//     .then((booking) => {
//         res.render('booking/payment', { booking });
//     })
//     .catch(err => console.log(err));
// });

router.get('/successful', async (req, res) => {
    const booking = await Booking.findAll({
        include: [
            { model: Class },
            { model: Course }
        ]
    });
    const courses = await Course.findAll();
    const classes = await Class.findAll();
    res.render('booking/successful', { booking, courses, classes });
});

module.exports = router;