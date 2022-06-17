const express = require('express');
const router = express.Router();
router.get('/login', (req, res) => {
    res.render('user/login');
});
router.get('/register', (req, res) => {
    res.render('user/register');
});

// Classes
router.get('/classes', (req, res) => {
    res.render('user/classes/list');
});

router.get('/classescreate', (req, res) => {
    res.render('user/classes/create');
});

router.get('/classesupdate', (req, res) => {
    res.render('user/classes/update');
});

module.exports = router;