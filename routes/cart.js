const express = require('express');
const router = express.Router();
const ensureAuthenticated = require("../helpers/auth");
const Booking = require('../models/Booking');
const Classes = require('../models/Class');
const Bookings = require('../models/Booking');
const path = require('path');
const Cart = require('../models/Cart');
// const shopController = require('../controllers/shop');


router.get('/', ensureAuthenticated, async (req, res) => {
    Cart.findAll({
        order: [['updatedAt', 'DESC']],
        raw: true
    })
        .then((items) => {
            console.log(items);
            res.render('cart/cart', { items });
        })
});

module.exports = router;