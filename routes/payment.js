const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const stripe = require('stripe')('sk_test_51LFiQDIDLAIUfWTrXJv037R9GA5KTPZF2W98ix0WKql786N6swgCubejuSMLMIuluPGiMUyVTgp9AIz6d17fiI0T00B189hFRp');
const YOUR_DOMAIN = 'http://localhost:5000/payment';


router.post('/bookingPayment/:id', async (req, res) => {
    var x = await Product.findOne({
        where: { id: req.params.id }
    })
    console.log(x)
    const price = await stripe.prices.create({
        unit_amount: x.price *100,
        currency: 'sgd',
        product: `${x.id}`,
    });
    console.log(price.id)
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                price: price.id,
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}/success`,
        cancel_url: `${YOUR_DOMAIN}/cancel`,
    });

    res.redirect(303, session.url);
});

router.get('/success', (req, res) => {
    res.redirect('/');
});

router.get('/cancel', (req, res) => {
    res.render('/');
});

router.get('/checkout', async (req, res) => {
    // const product = await stripe.products.create({
    //     id: `${x.id}`,
    //     name: `${x.name}`,
    // });
    // console.log(product)
    res.render('payment/checkout');
});
module.exports = router;