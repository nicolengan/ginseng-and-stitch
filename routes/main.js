const express = require('express');
const router = express.Router();
const fs = require('fs');
const validator = require("email-validator");


// models
const Classes = require('../models/Class');
const Courses = require('../models/Course');
const Review = require('../models/Review');
const Users = require('../models/User');
const Product = require('../models/Product');
const Enquiry = require('../models/Enquiry');
const Traffic = require('../models/Traffic');


// helpers
const upload = require('../helpers/fileUpload');
const sendEmail = require('../helpers/sendEmail');
const flashMessage = require('../helpers/messenger');

// routes
const booking = require("./booking");
const account = require("./account");
const cart = require('./cart');
const payment = require("./payment");

router.use('/account', account);
router.use('/booking', booking);
router.use('/cart', cart);
router.use('/payment', payment);

router.get('/', async async (req, res) => {
    const title = 'Ginseng and Stitch';
    const month_arr = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const curr_date = new Date();
    let month = month_arr[curr_date.getMonth()];
    let year = curr_date.getFullYear();
    // console.log(year)
    Traffic.findOrCreate({
        where: {month: month, year: year}
    })
    var x = await Traffic.increment({count: 1}, { where: { month: month, year: year } })
        .catch(err => console.log(err));
    // console.log(JSON.stringify(x))
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
            { model: Review,         
                include: [
                { model: Users }
            ]}
        ],
        raw: true
    })
        .then((coursesInfo) => {
            
            let coursesDict = {};
            console.log(coursesInfo);
            
            for (let i = 0; i < coursesInfo.length; i++)
            {
                const singleCourse = coursesInfo[i];

                if (!(singleCourse.id in coursesDict))
                {
                    coursesDict[singleCourse.id] = {
                            id: singleCourse.id,
                            title: singleCourse.title,
                            level: singleCourse.level,
                            description: singleCourse.description,
                            price: singleCourse.price,
                            coursePic: singleCourse.coursePic,
                            star_count : 0,
                            reviews: []
                        };
                }
                if (singleCourse["Reviews.review"] != null &&
                singleCourse["Reviews.User.name"] != null
                )

                coursesDict[singleCourse.id].reviews.push(
                    {
                        name : singleCourse["Reviews.User.name"],
                        review : singleCourse["Reviews.review"],
                        star_count : singleCourse["Reviews.star_count"]
                    });
            }

            
            let courses = Object.values(coursesDict);

            for (let i = 0 ; i < courses.length; i++)
            {
                if (courses[i].reviews.length == 0)
                    continue;

                let star = 0;
                for (let j = 0; j < courses[i].reviews.length; j++)
                {
                    star += courses[i].reviews[j].star_count;
                }
                courses[i].star_count = star / courses[i].reviews.length;
            }



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
            // console.log(enquiry.toJSON());
            var subject = 'RE: ' + enquiry.subject
            var message = `<p>Hello, ${enquiry.name},<br> thank you for contacting us. Your enquiry has been received. Our team will get back to your enquiry in 1-3 business days.</p>`
            var email = enquiry.email
            sendEmail(email, subject, message);
            console.log('Reply sent to ' + enquiry.email);
            flashMessage(res, 'success', 'Enquiry sent successfully!');
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