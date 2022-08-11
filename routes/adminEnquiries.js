const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
const bcrypt = require('bcryptjs');
const flashMessage = require('../helpers/messenger');


router.get('/', (req, res) => {
    res.render('admin/enquiries/listEnquiries');
});

router.get('/api/list', async (req, res) => {
    // console.log("hiii")
    return res.json({
        total: await Enquiry.count(),
        rows: await Enquiry.findAll()
    })
});
router.get('/', (req, res) => {
    res.render('admin/enquiries/listEnquiries');
});
router.post('/replyEnquiries/:id', async (req, res) => {
    console.log(JSON.stringify(req.body));
    let reply = req.body.reply;
    console.log(reply)
    let enquiry = await Enquiry.findOne({ where: { id: req.params.id } })
    enquiry.update( {reply: reply} )
        .then((result) => {
            var subject = 'RE: ' + enquiry.subject
            console.log(subject)
            console.log(result + ' reply sent successfully');
            res.redirect('/admin/enquiries');
        })
        .catch(err => console.log(err));
});

module.exports = router;