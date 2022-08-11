const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ensureAuthenticated = require('../helpers/auth');
const defaultPartial = require('../helpers/default')
const bcrypt = require('bcryptjs');
const passport = require('passport');
const crypto = require('crypto');
const flashMessage = require('../helpers/messenger');

const classes = require("./adminClasses");
const courses = require("./adminCourses");
const products = require("./adminProducts");
const users = require("./adminUsers");
const enquiries = require("./adminEnquiries");
const reviews = require("./adminReviews");


router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin',
    'whichPartial', function(context, options) { return "_admin" }
    // set your layout here
    next(); // pass control to the next handler
});

router.use('/classes', classes);
router.use('/courses', courses);
router.use('/products', products);
router.use('/users', users);
router.use('/enquiries', enquiries);
router.use('/reviews', reviews);

router.get('/', (req, res) => {
    res.render('admin/dashboard'
    // {
    //     whichPartial: function() {
    //         return "";
    //    }
    // }

    // Get all courses; IE Courese.GetAll

    // Lopp through courses, get all reviews where courseID = courses[].id
    // reconstruct into a new object, IE
    // ReviewData
    //  course
    //  review[]

    // Send as context to handlerbar

    );
});

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
        console.log("Admin logged out successfully");
        flashMessage(res, 'success', ' logged out successfully');
    });
});

module.exports = router;