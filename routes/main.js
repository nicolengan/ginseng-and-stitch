const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const Courses = require('../models/Course');
const ensureAuthenticated = require("../helpers/auth");

// routes
const booking = require("./booking");
const account = require("./account");
// const payment = require("./payment");

router.use('/account', account);
router.use('/booking', booking);
// router.use('/payment', payment);

router.get('/', (req, res) => {
    const title = 'Ginseng and Stitch';
    // renders views/index.handlebars, passing title as an object
    res.render('index', { title: title })
});

router.get('/about', (req, res) => {
    res.render('about');
});


router.get('/courses', (req, res) => {
    Courses.findAll({
        // where: { userId: req.user.id },
        raw: true
    })
        .then((courses) => {
            // pass object to listVideos.handlebar
            res.render('courses', { courses});
        })
        .catch(err => console.log(err));
});

router.get('/contactUs', (req, res) => {
    res.render('contactUs');
});

module.exports = router;