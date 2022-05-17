const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const title = 'Ginseng and Stitch';
    // renders views/index.handlebars, passing title as an object
    res.render('index', { title: title })
});

router.get('/about', (req, res) => {
    res.render('about');
});
router.get('/products', (req, res) => {
    res.render('products');
});

router.get('/workshops', (req, res) => {
    res.render('workshops');
});

router.get('/contactUs', (req, res) => {
    res.render('contactUs');
});
module.exports = router;