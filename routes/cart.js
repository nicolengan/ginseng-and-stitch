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

router.post('/addProductToCart', ensureAuthenticated, (req, res) => {
    let prod_name = req.body.prod_name;
    let quantity = req.body.quantity;
    let price = req.body.price;
    let UserId = req.user.id;
    console.log(req.body);
    Cart.create(
        { prod_name, quantity, price, UserId }
    )
        .then((item) => {
            console.log(item.toJSON());
            res.redirect('cart/cart');
        })
        .catch(err => console.log(err))
});

router.get('/api/list', async (req, res) => {
    return res.json({
        total: await Cart.count(),
        rows: await Cart.findAll()
    })
});

router.get('/deleteItemFromCart/:id', async function (req, res) {
    try {
        await Product.destroy({ where: { id: req.params.id } })
        .then((result) => {
            console.log(result[0] + ' deleted');
            res.redirect('cart/cart');
        })
        .catch(err => console.log(err));
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;