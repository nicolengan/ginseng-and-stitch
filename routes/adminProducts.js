const express = require('express');
const router = express.Router();
const moment = require('moment');
const Product = require('../models/Product');
const ensureAuthenticated = require('../helpers/auth');
const flashMessage = require('../helpers/messenger');
const fs = require('fs');
const upload = require('../helpers/imageUpload');

router.get('/', ensureAuthenticated, (req, res) => {
    Product.findAll({
        order: [['updatedAt', 'DESC']],
        raw: true
    })
        .then((products) => {
            // pass object to listVideos.handlebar
            res.render('admin/products/listProducts', { products });
        })
        .catch(err => console.log(err));
});

router.get('/api/list', async (req, res) => {
    return res.json({
        total: await Product.count(),
        rows: await Product.findAll()
    })
});


router.get('/addProducts', ensureAuthenticated, (req, res) => {
    res.render('admin/products/addProducts');
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
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err))
});

router.get('/editProduct/:id', ensureAuthenticated, (req, res) => {
    
    Product.findByPk(req.params.id)
        .then((product) => {
            if (!product) {
                flashMessage(res, 'error', 'Product not found');
                res.redirect('/admin/products');
                return;
            }
            // if (req.user.id != product.userId) {
            //     flashMessage(res, 'error', 'Unauthorised access');
            //     res.redirect('/products');
            //     return;
            // }
            console.log(product);
            res.render('admin/products/editProduct', { product });
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
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
});

router.get('/deleteProduct/:id', async function (req, res) {
    try {
        await Product.destroy({ where: { id: req.params.id } })
        .then((result) => {
            console.log(result[0] + ' deleted');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
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