const { Router } = require('express');
const router = Router();
const flashMessage = require('../helpers/messenger');
const isAdmin = require('../helpers/admin');

router.use(function (req, res, next) {
	res.locals.messages = req.flash('message');
	res.locals.errors = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

//	Insert other sub routes here
router.use("/account",  require("./account"));
router.use("/admin", isAdmin, require("./admin"));

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

router.use(function (error, req, res, next) {
	return res.status(500).end();
});
router.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
});
module.exports = router;