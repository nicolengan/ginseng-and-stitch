const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Booking = require('../models/Booking');
const Course = require('../models/Course');
const stripe = require('stripe')('sk_test_51LFiQDIDLAIUfWTrXJv037R9GA5KTPZF2W98ix0WKql786N6swgCubejuSMLMIuluPGiMUyVTgp9AIz6d17fiI0T00B189hFRp');
const YOUR_DOMAIN = 'http://localhost:5000';


router.get('/bookingPayment/:id', async (req, res) => {
    var x = await Booking.findOne({
        where: { id: req.params.id },
        include: { model: Course }
    })
    const events = await stripe.events.list({
        limit: 3,
      });
    console.log(events)    
    // console.log(x.Course.price)
    // const product = await stripe.products.search({
    //     query: `name:\'${x.name}\'`,
    //   });
    // console.log(product)
    // if (product == null) {
    //     const product = await stripe.products.create({
    //         id: `${x.id}`,
    //         name: `${x.name}`,
    //     });
    // }
    // const price = await stripe.prices.create({
    //     unit_amount: x.Course.price * 100,
    //     currency: 'sgd',
    //     product_data: `${x.name}`
    // });
    // console.log(price.id)
    const session = await stripe.checkout.sessions.create({
        // line_items: [
        //     {
        //         // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        //         price: price.id,
        //         quantity: 1,
        //     },
        // ],
        line_items: [
            {
              price_data: {
                currency: 'SGD',
                product_data: {
                  name: `${x.Course.title}`,
                },
                unit_amount: x.Course.price * 100,
              },
              quantity: 1,
            }],
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}/booking/successful/${x.id}`,
        cancel_url: `${YOUR_DOMAIN}`,
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
    // console.log(product)
    res.render('payment/checkout');
});
module.exports = router;