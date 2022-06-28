const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const Classes = require('../models/Classes');
const ensureAuthenticated = require("../helpers/auth");

router.get('/', (req, res) => {
    const title = 'Ginseng and Stitch';
    // renders views/index.handlebars, passing title as an object
    res.render('index', { title: title })
});

router.get('/about', (req, res) => {
    res.render('about');
});
router.get('/products', (req, res) => {
    res.render('products');
});

router.get('/classes', (req, res) => {
    res.render('classes');
});

router.get('/contactUs', (req, res) => {
    res.render('contactUs');
});

// BOOKING SESSION
router.get('/book', (req, res) => {
    res.render('booking/book');
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

router.get('/search', (req, res) => {
    res.render('booking/search');
});

module.exports = router;