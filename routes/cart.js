const express = require('express');
const router = express.Router();
const ensureAuthenticated = require("../helpers/auth");
const Booking = require('../models/Booking');
const Classes = require('../models/Class');
const path = require('path');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const db = require('../config/DBConfig');
const { ResultWithContext } = require('express-validator/src/chain');
const flashMessage = require('../helpers/messenger');
// const shopController = require('../controllers/shop');


router.get('/', ensureAuthenticated, async (req, res) => {
    let [items, metadata] = await db.query(
        `SELECT carts.prod_name, carts.quantity, carts.price, carts.id as cartId, carts.UserId as UserId, products.posterURL, products.id as productId
        FROM carts JOIN products
        ON carts.prod_name = products.prod_name
        WHERE carts.UserId = ${req.user.id}`,
    )
    let user = req.user
    res.render('cart/cart', { items, user });
});

router.post('/addProductToCart', ensureAuthenticated, async (req, res) => {
    let prod_name = req.body.prod_name;
    let quantity = req.body.quantity;
    let price = req.body.price;
    let UserId = req.user.id;
    console.log(req.body);
    let cartItem = await Cart.findOne({ where: {
        prod_name: prod_name,
        UserId: req.user.id
    }})

    if (!cartItem) {
        let newPrice = parseFloat(price) * parseInt(quantity);
        Cart.create(
            { prod_name, quantity, price: newPrice, UserId }
        )
            .then((item) => {
                console.log(item.toJSON());
                flashMessage(res, 'success', 'Item has been added into the cart');
                res.redirect('cart/cart');
            })
            .catch(err => console.log(err))
    }
    else {
        let newQuantity = parseInt(cartItem.quantity) + parseInt(quantity)
        let newPrice = parseFloat(price) * parseInt(newQuantity)
        Cart.update(
            { quantity: newQuantity, price: newPrice },
            {where: {
                prod_name: prod_name,
                UserId: req.user.id
            }}
        )
    }
});

// router.get('/api/list', async (req, res) => {
//     return res.json({
//         total: await Cart.count(),
//         rows: await Cart.findAll({
//             // where: UserId = req.user.id
//         })
//     })
// });

router.get('/deleteItemFromCart/:id', async function (req, res) {
    try {
        await Cart.destroy({ where: { id: req.params.id } })
        .then((result) => {
            console.log(result[0] + ' deleted');
            flashMessage(res, 'success', 'Successfully deleted item from cart');
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;