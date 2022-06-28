const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin'; // set your layout here
    next(); // pass control to the next handler
});

router.get('/api/list', async (req, res) => {
    return res.json({
        total: await User.count(),
        rows: await User.findAll()
    })
});

router.get('/list', async (req, res) => {
    res.render('admin/dashboard');
});
module.exports = router;