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
const { Op } = require("sequelize");
const stripe = require('stripe')('sk_test_51LFiQDIDLAIUfWTrXJv037R9GA5KTPZF2W98ix0WKql786N6swgCubejuSMLMIuluPGiMUyVTgp9AIz6d17fiI0T00B189hFRp');

const classes = require("./adminClasses");
const courses = require("./adminCourses");
const products = require("./adminProducts");
const users = require("./adminUsers");
const enquiries = require("./adminEnquiries");
const reviews = require("./adminReviews");
const codes = require("./adminCodes");
const Enquiry = require('../models/Enquiry');


router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin'
    // set your layout here
    next(); // pass control to the next handler
});

router.use('/classes', classes);
router.use('/courses', courses);
router.use('/products', products);
router.use('/users', users);
router.use('/enquiries', enquiries);
router.use('/reviews', reviews);
router.use('/codes', codes);
router.use('/codes', codes);


router.get('/', async (req, res) => {
    const curr_date = new Date();
    let year = curr_date.getFullYear();
    let traffic = await Traffic.findAll({ where: { year: year } })
    let admins = await User.count({ where: { role: 'F' } })
    let users = await User.count({ where: { gender: 'M' } })
    // console.log(JSON.stringify(x))
    let enquiries = await Enquiry.count({ where: { status: 0 } })
    // console.log(data)
    // console.log(JSON.stringify(users))
    // console.log(users)
    res.render('admin/dashboard', { traffic, year, admins, users, enquiries});
});

router.get('/api/listCustomer', async (req, res) => {
    const customers = await stripe.customers.list(
        { limit: 100 },
    )
    // console.log(customers.length)
    // .then((result)=>{
    //     console.log(result.data.length)
    // })
    return res.json({
        rows: customers.data
    })
});

router.get('/api/listInvoice', async (req, res) => {
    const events = await stripe.events.list({
        limit: 100,
        type: 'charge.succeeded',
    });
    return res.json({
        rows: events.data
    })
});

router.get('/api/listUser', async (req, res) => {
    return res.json(
        await User.findAll(
            {
                attributes: ['gender'],
                where: { gender: {[Op.not]: null} }
            }
        )
    )
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