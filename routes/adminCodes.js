const express = require('express');
const Code = require('../models/Code');
const Coupon = require('../models/Coupon');
const flashMessage = require('../helpers/messenger');
const stripe = require('stripe')('sk_test_51LFiQDIDLAIUfWTrXJv037R9GA5KTPZF2W98ix0WKql786N6swgCubejuSMLMIuluPGiMUyVTgp9AIz6d17fiI0T00B189hFRp');
const router = express.Router();

router.get('/', async (req, res) => {
    res.render('admin/codes/listCodes');
});


router.get('/api/list', async (req, res) => {
    return res.json({
        total: await Code.count(),
        rows: await Code.findAll(
            { include: { model: Coupon }} 
        )
    })
});

router.post('/addCode', async (req, res) => {
    let name = req.body.name;
    let percentage = req.body.percentage;

    console.log(percentage)

    let check = await Coupon.findOne(
        { where: { percentage: percentage } }
    )
    console.log(check)
    try {
        var coupon_id = ''
        if (!check) {
            console.log("hii")
            console.log(percentage)
            var coupon = await stripe.coupons.create({
                percent_off: percentage,
                duration: 'repeating',
                duration_in_months: 3,
            });
            coupon_id = coupon.id
            await Coupon.create({ percentage: percentage, coupon: coupon.id });
        }
        else {
            coupon_id = check.coupon
        }
        console.log(coupon)
        let code = await Code.findOne(
            { where: { code: name } }
        )
        if (code) {
            flashMessage(res, 'error', 'Code ' + name + ' already exists.');
            res.redirect('/admin/codes');
        }
        else{
            const promotionCode = await stripe.promotionCodes.create({
                coupon: `${coupon_id}`,
                code: `${name}`,
            });
            await Code.create({ code: name, coupon: coupon_id });
            flashMessage(res, 'success', 'Code ' + name + ' added successfully');
            res.redirect('/admin/codes');
        }

    } catch (err) {
        console.log(err);
    }


});


module.exports = router;