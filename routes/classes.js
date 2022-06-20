const express = require('express');
const router = express.Router();

// Classes
router.get('/classes', (req, res) => {
    res.render('classes/listClasses');
});

router.get('/addClasses', (req, res) => {
    res.render('classes/addClasses');
});
 
router.get('/updateClasses', (req, res) => {
    res.render('classes/updateClasses');
});