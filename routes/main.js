const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const Classes = require('../models/Classes');
const ensureAuthenticated = require("../helpers/auth");
const courses = require("./courses");
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

router.get('/courses', (req, res) => {
    res.render('courses');
});

router.get('/contactUs', (req, res) => {
    res.render('contactUs');
});

module.exports = router;