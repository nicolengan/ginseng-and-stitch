const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const ensureAuthenticated = require("../helpers/auth");
const Booking = require('../models/Booking');
const Class = require('../models/Class');
const Cart = require('../models/Cart');
const Course = require('../models/Course');
const User = require('../models/User');
const sendEmail = require('../helpers/sendEmail');
const nodemailer = require("nodemailer");

router.get('/', async (req, res) => {
    const booking = await Booking.findAll({
        include: [
            { model: Class },
            { model: Course }
        ]
    });
    res.render('booking/listBooking', { booking });
});

router.get('/api/list', async (req, res) => {
    return res.json({
        total: await Booking.count(),
        rows: await Booking.findAll({
            include: [
                { model: Class },
                { model: Course}
            ]
        })
    })
});

router.get('/listBooking/:id', async (req, res) => {
    const booking = await Booking.findAll({
        include: [
            { model: Class },
            { model: Course }
        ],
        where:{
            id: req.params.id
        }
        
    });
    const courses = await Course.findAll();
    const classes = await Class.findAll();
    res.render('booking/listBooking', { booking, courses, classes });
});

// so req.params.id is getting ur /:id part in ur url
// the :id in url is the course id

router.get('/addBooking/:id', ensureAuthenticated, async (req, res) => {
    const booking = await Booking.findAll({
         include: [
             { model: Class },
             { model: Course }
         ]
     });
    const courses = await Course.findAll(
        {
            where: {
                id: req.params.id
            }
        });
    const classes = await Class.findAll(
        {
            where: {
                CourseId: req.params.id
            }
        });
    res.render('booking/addBooking', { booking, courses, classes });
});

router.post('/addBooking/:id', ensureAuthenticated, async (req, res) => {
    let CourseId = req.body.CourseId;
    let ClassId = req.body.ClassId;
    let UserId = req.user.id;

    Booking.create(
        { CourseId, ClassId, UserId },
        { where: { id: req.params.id } }
    )

        .then((classes) => {
            console.log(classes.toJSON());
            res.redirect('/booking/listbooking/' + classes.id);
            // res.redirect('/booking/confirm/');
        })
        .catch(err => console.log(err))
});


router.get('/editBooking/:id', ensureAuthenticated, async (req, res) => {
    var booking = await Booking.findByPk(req.params.id, {
        include: [
            { model: Class },
            { model: Course }
        ]
    });
    const courses = await Course.findAll(
        {
            where: {
                id: booking.CourseId
            }
        });
    
    const classes = await Class.findAll(
        {
            where: {
                CourseId: booking.CourseId
            }
        });
    res.render('booking/editBooking', { booking, courses, classes });
});

router.post('/editBooking/:id', ensureAuthenticated, async (req, res) => {
    let CourseId = req.body.CourseId;
    let ClassId = req.body.ClassId;

    await Booking.update(
        { CourseId, ClassId },
        { where: { id: req.params.id } }
    )
        .then((result) => {
            console.log(result[0] + ' booking updated');
            var subject = 'Successful Course Booking Update'
            var html = '<p>Successful booking update. <br> Please remember to drop us a review after you have completed your class. <br> Your feedback is much appreciated. <br> Review Link: http://localhost:5000/account/review/' + req.params.id + '</p> '
            sendEmail(req.user.email, subject, html);
            flashMessage(res, 'success', 'Successfully updated booking');
            res.redirect('/account/bookings');
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
        flashMessage(res, 'success', 'Successfully deleted booking');
        res.redirect('/account');
    }
    catch (err) {
        console.log(err);
    }
});

router.get('/successful/:id', async (req, res) => {
    const booking = await Booking.findOne({
        include: [
            { model: Class },
            { model: Course }
        ],
        where: {
            id: req.params.id
        }
    });
    console.log(booking)
    console.log(booking.id)
    // const courses = await Course.findAll();
    // const classes = await Class.findAll();
    var subject = 'Successful Booked Your Course '
    var html = `<p>Hurray! You have successfully booked your course. ${booking.Course.title} <br> Please remember to drop us a review after you have completed your class. <br> Your feedback is much appreciated. <br> Review Link: http://localhost:5000/account/review/${req.params.id}</p> `
    sendEmail(req.user.email, subject, html);
    flashMessage(res, 'success', 'successfully updated booking');

    res.render('booking/successful', { booking });
});


module.exports = router;