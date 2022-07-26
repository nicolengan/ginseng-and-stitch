const express = require('express');
const router = express.Router();
const moment = require('moment');
const Product = require('../models/Product');
const ensureAuthenticated = require('../helpers/auth');
const flashMessage = require('../helpers/messenger');
const upload = require('../helpers/imageUpload');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin'; // set your layout here
    next(); // pass control to the next handler
});

router.get('/listProducts', (req, res) => {
    res.render('products/products');
});

router.get('/', ensureAuthenticated, (req, res) => {
    Product.findAll({
        order: [['updatedAt', 'DESC']],
        raw: true
    })
        .then((products) => {
            // pass object to listVideos.handlebar
            res.render('products/products', { products });
        })
        .catch(err => console.log(err));
});

router.get('/addProducts', ensureAuthenticated, (req, res) => {
    res.render('products/addProducts');
});

router.post('/addProducts', ensureAuthenticated, (req, res) => {
    let prod_name = req.body.prod_name;
    let prod_desc = req.body.prod_desc.slice(0, 1999);
    let difficulty =  req.body.difficulty === undefined ? '' : req.body.difficulty.toString();
    // Multi-value components return array of strings or undefined
    let stock = req.body.stock;
    let price = req.body.price;

    Product.create(
        { prod_name, prod_desc, difficulty, stock, price }
    )
        .then((product) => {
            console.log(product.toJSON());
            res.redirect('/products');
        })
        .catch(err => console.log(err))
});

router.get('/editProduct/:id', ensureAuthenticated, (req, res) => {
    
    Product.findByPk(req.params.id)
        .then((product) => {
            if (!product) {
                flashMessage(res, 'error', 'Product not found');
                res.redirect('/products');
                return;
            }
            // if (req.user.id != product.userId) {
            //     flashMessage(res, 'error', 'Unauthorised access');
            //     res.redirect('/products');
            //     return;
            // }
            res.render('products/editProduct', { product });
        })
        .catch(err => console.log(err));
});

router.post('/editProduct/:id', ensureAuthenticated, (req, res) => {
    let prod_name = req.body.prod_name;
    let prod_desc = req.body.prod_desc.slice(0, 1999);
    let stock = req.body.stock.toString();
    let difficulty = req.body.difficulty === undefined ? '' : req.body.difficulty.toString();
    let price = req.body.price;

    Product.update(
        { prod_name, prod_desc, stock, difficulty, price },
        { where: { id: req.params.id } }
    )
        .then((result) => {
            console.log(result[0] + ' product updated');
            res.redirect('/products');
        })
        .catch(err => console.log(err));
});

router.get('/deleteProduct/:id', ensureAuthenticated, async function (req, res) {
    try {
        let product = await Product.findByPk(req.params.id);
        if (!product) {
            flashMessage(res, 'error', 'product not found');
            res.redirect('/products');
            return;
        }

        let result = await Product.destroy({ where: { id: product.id } });
        console.log(result + ' product deleted');
        res.redirect('/products');
    }
    catch (err) {
        console.log(err);
    }
});

router.post('/upload', ensureAuthenticated, (req, res) => {
    // Creates user id directory for upload if not exist
    if (!fs.existsSync('./public/uploads/' + req.user.id)) {
        fs.mkdirSync('./public/uploads/' + req.user.id, { recursive: true });
    }

    upload(req, res, (err) => {
        if (err) {
            // e.g. File too large
            res.json({ file: '/img/no-image.jpg', err: err });
        }
        else {
            res.json({ file: `/uploads/${req.user.id}/${req.file.filename}` });
        }
    });
});

module.exports = router;