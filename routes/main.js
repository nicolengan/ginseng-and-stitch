const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const Courses = require('../models/Course');
const Review = require('../models/Review');
const Users = require('../models/User');
const Enquiry = require('../models/Enquiry');
const fs = require('fs');
const upload = require('../helpers/fileUpload');
const validator = require("email-validator");
// routes
const booking = require("./booking");
const account = require("./account");
const Product = require('../models/Product');
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
        include: [
            { model: Review,         include: [
                { model: Users }
            ]}
        ],
        raw: true
    })
        .then((courses) => {
            console.log(courses)
            // pass object to listVideos.handlebar
            res.render('courses', { courses });
        })
        .catch(err => console.log(err));
});

router.get('/contactUs', (req, res) => {
    res.render('contactUs');
});

router.post('/contactUs', (req, res) => {
    let { name, email, subject, comments, fileURL } = req.body;
    let isValid = true;
    if (!validator.validate(email)) {
        flashMessage(res, 'error', 'Email is not in a valid format (name@email.com), please try again.');
        isValid = false;
    }
    if (!isValid) {
        res.render('contactUs', {
        });
        return;
    }
    Enquiry.create(
        { name, email, subject, comments, fileURL }
    )
        .then((enquiry) => {
            console.log(enquiry.toJSON());
            res.redirect('/');
        })
        .catch(err => console.log(err))
});

router.post('/fileUpload', (req, res) => {
    // Creates user id directory for upload if not exist
    // else {
    //     user = x
    // }
    if (!fs.existsSync('./public/uploads/' + 'contactUs')) {
        fs.mkdirSync('./public/uploads/' + 'contactUs', {
            recursive:
                true
        });
    }
    upload(req, res, (err) => {
        if (err) {
            // e.g. File too large
            res.json({ file: '/img/no-image.jpg', err: err });
        }
        else {
                res.json({
                    file: `/uploads/contactUs/${req.file.filename}`
                });
        }
    });
});

router.get('/products', (req, res) => {
    Product.findAll({
        // where: { userId: req.user.id },
        raw: true
    })
        .then((products) => {
            // pass object to listVideos.handlebar
            res.render('products', { products });
        })
        .catch(err => console.log(err));
});

module.exports = router;