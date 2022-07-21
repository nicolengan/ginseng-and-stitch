const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const Classes = require('../models/Class');
const ensureAuthenticated = require("../helpers/auth");
const classes = require("./classes");
const courses = require("./courses");
const User = require('../models/User');

router.use('/account', require("./account"));
router.use('/booking', require("./account"));

// redirects error to page
router.use('/payment', require("./payment"));

router.get('/', (req, res) => {
    const title = 'Ginseng and Stitch';
    // renders views/index.handlebars, passing title as an object
    res.render('index', { title: title })
});

router.get('/about', (req, res) => {
    res.render('about');
});

router.use('/courses', courses)

router.get('/courses', (req, res) => {
    res.render('courses');
});

router.use('/classes', classes)

router.get('/classes', (req, res) => {
    res.render('classes');
});

router.get('/contactUs', (req, res) => {
    res.render('contactUs');
});

module.exports = router;