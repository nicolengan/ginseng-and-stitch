const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const ensureAuthenticated = require("../helpers/auth");

// routes
const booking = require("./booking");
const account = require("./account");
const payment = require("./payment");

router.use('/account', account);
router.use('/booking', booking);
router.use('/payment', payment);

// redirects error to page
router.use(function(req, res, next) {
    res.locals.messages = req.flash('message');
    res.locals.errors = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

router.get('/', (req, res) => {
    const title = 'Ginseng and Stitch';
    // renders views/index.handlebars, passing title as an object
    res.render('index', { title: title })
});

router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/courses', (req, res) => {
    res.render('courses');
});

router.get('/contactUs', (req, res) => {
    res.render('contactUs');
});

module.exports = router;