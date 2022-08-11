const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const Courses = require('../models/Course');
const Enquiry = require('../models/Enquiry');
const ensureAuthenticated = require("../helpers/auth");
const fs = require('fs');
const upload = require('../helpers/fileUpload');
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
        raw: true
    })
        .then((courses) => {
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