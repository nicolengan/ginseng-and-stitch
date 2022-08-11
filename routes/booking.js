const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const ensureAuthenticated = require("../helpers/auth");
const Booking = require('../models/Booking');
const Class = require('../models/Class');
const Course = require('../models/Course');
const User = require('../models/User');
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


// router.get('/api/list', async (req, res) => {
//     return res.json({
//         total: await Booking.count(),
//         rows: await Booking.findAll()
//     })
// });
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

// BOOKING SESSION
//booking id, course id, class id, user id, date created

//book will be listBooking
router.get('/listBooking', ensureAuthenticated, async (req, res) => {
    const booking = await Booking.findAll({
        include: [
            { model: Class },
            { model: Course }
        ],
        where:{
            id: req.params.id
        }
    });
    res.render('booking/listBooking', { booking });
});


router.get('/addBooking', ensureAuthenticated, async (req, res) => {
    const booking = await Booking.findAll({
        include: [
            { model: Class },
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

            sendEmailUpdate(req.user.email, req.params.id);
            flashMessage(res, 'successfully updated booking');
            res.redirect('/account');
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

router.get('/checkout/', async (req, res) => {
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

router.get('/confirm/:id', async (req, res) => {
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


router.get('/successful/:id', async (req, res) => {
    const booking = await Booking.findAll({
        include: [
            { model: Class },
            { model: Course }
        ],
        where:{
            id: req.params.id
        }
    });
    // const courses = await Course.findAll();
    // const classes = await Class.findAll();
    res.render('booking/successful', { booking });
});

async function sendEmail(email, booking) {
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
        subject: 'Successful Course Booking',
        html: '<p>Successful booking. We hope you enjoy your class. <br> Please remember to drop us a review after you have completed your class. <br> Your feedback is much appreciated <br>Review Link: http://localhost:5000/account/review/' + booking.id + '</p> '
    };
    mail.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log(info)
        }
    });
}

router.get('/successful/sendEmail/:id', async (req, res) =>{
    const booking = await Booking.findOne({
        include: [
            { model: Class },
            { model: Course }
        ],
        where:{
            id: req.params.id
        }
    });

    // const user = await User.findOne({ where: { id: res.user.id } })
        
    console.log(req.user.email);

    await sendEmail(req.user.email, booking);

    res.redirect('/account');
});


async function sendEmailUpdate(email, booking) {
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
            subject: 'Successful Course Booking Update',
            html: '<p>Successful booking update. <br> Please remember to drop us a review after you have completed your class. <br> Your feedback is much appreciated. <br> Review Link: http://localhost:5000/account/review/' + booking + '</p> '
        };
        mail.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
            } else {
                console.log(info)
            }
        });
    }

module.exports = router;