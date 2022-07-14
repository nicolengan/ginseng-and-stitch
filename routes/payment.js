const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
router.post('/', async (req, res) => {
    const product = await stripe.products.create({ name: 'T-shirt' });
    const price = await stripe.prices.create({
        product: '{{PRODUCT_ID}}',
        unit_amount: 2000,
        currency: 'sgd',
    });
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                price: '{{PRICE_ID}}',
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `/`,
        cancel_url: `/account`,
    });

    res.redirect(303, session.url);
});
module.exports = router;