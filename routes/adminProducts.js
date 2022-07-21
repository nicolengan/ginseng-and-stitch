const express = require('express');
const router = express.Router();
const moment = require('moment');
const Product = require('../models/Product');
const ensureAuthenticated = require('../helpers/auth');
const flashMessage = require('../helpers/messenger');

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
    let quantity = req.body.quantity.toString();

    Product.create(
        { prod_name, prod_desc, difficulty, quantity }
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
    let quantity = req.body.quantity.toString();
    let difficulty = req.body.difficulty === undefined ? '' : req.body.difficulty.toString();

    Product.update(
        { prod_name, prod_desc, quantity, difficulty },
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

module.exports = router;