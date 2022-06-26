const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const courses = require("./courses");
const admin = require("../helpers/admin");
const isAdmin = require("../helpers/admin");
const User = require('../models/User');

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

router.use('/courses', courses)

router.use('/admin', isAdmin, admin);

router.get('/courses', (req, res) => {
    res.render('courses');
});

router.get('/workshops', (req, res) => {
    res.render('workshops');
});

router.get('/contactUs', (req, res) => {
    res.render('contactUs');
});

module.exports = router;