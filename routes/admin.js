const express = require('express');
const router = express.Router();
const Traffic = require('../models/Traffic');
const User = require('../models/User');
const ensureAuthenticated = require('../helpers/auth');
const defaultPartial = require('../helpers/default')
const bcrypt = require('bcryptjs');
const passport = require('passport');
const crypto = require('crypto');
const flashMessage = require('../helpers/messenger');
const stripe = require('stripe')('sk_test_51LFiQDIDLAIUfWTrXJv037R9GA5KTPZF2W98ix0WKql786N6swgCubejuSMLMIuluPGiMUyVTgp9AIz6d17fiI0T00B189hFRp');

const classes = require("./adminClasses");
const courses = require("./adminCourses");
const products = require("./adminProducts");
const users = require("./adminUsers");
const enquiries = require("./adminEnquiries");
const reviews = require("./adminReviews");
const sequelize = require('sequelize');


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

router.get('/', async (req, res) => {
    const curr_date = new Date();
    let year = curr_date.getFullYear();
    let traffic = await Traffic.findAll({where: {year: year}})
    let admins = await User.count({where: {role: 'a'}})
    let users = await User.count({where: {role: 'u'}})
    // console.log(data)
    // console.log(JSON.stringify(users))
    // console.log(users)
    res.render('admin/dashboard', {traffic, year, admins, users});
});

router.get('/api/listCustomer', async (req, res) => {
    const customers = await stripe.customers.list()
    // .then((result)=>{
    //     console.log(result.data.length)
    // })
    return res.json({
        rows: customers.data
    })
});

router.get('/api/listInvoice', async (req, res) => {
    const events = await stripe.events.list({
        type: 'charge.succeeded',
      });
    // .then((result)=>{
    //     console.log(result.data.length)
    // })
    // console.log(events.data.created)
    return res.json({
        rows: events.data
    })
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