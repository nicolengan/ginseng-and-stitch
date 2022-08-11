const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
const bcrypt = require('bcryptjs');
const flashMessage = require('../helpers/messenger');
const sendEmail = require('../helpers/sendEmail');
var http = require('http');
var fs = require('fs');


router.get('/', (req, res) => {
    res.render('admin/enquiries/listEnquiries');
});

router.get('/api/list', async (req, res) => {
    return res.json({
        total: await Enquiry.count(),
        rows: await Enquiry.findAll()
    })
});
router.get('/replyEnquiries/:id', (req, res) => {
    Enquiry.findOne({
        where: { id: req.params.id },
        raw: true
    })
        .then((enquiry) => {
            res.render('admin/enquiries/replyEnquiries', enquiry);
        })
        .catch(err => console.log(err));

});

router.post('/replyEnquiries/:id', async (req, res) => {
    console.log(JSON.stringify(req.body));
    let reply = req.body.reply;
    let status = req.body.status;
    console.log(reply)
    let enquiry = await Enquiry.findOne({ where: { id: req.params.id } })
    enquiry.update({ reply: reply, status: status })
        .then((result) => {
            var subject = 'RE: ' + enquiry.subject
            var message = `<p>${reply}</p>`
            var email = enquiry.email
            var sent = sendEmail(email, subject, message);
            console.log(sent)
            console.log(result + ' reply sent.');
            res.redirect('/admin/enquiries');
        })
        .catch(err => console.log(err));
});

router.get('/download:id', async (req, res) =>{
    let enquiry = await Enquiry.findOne({ where: { id: req.params.id } })
    const file = `./public${enquiry.fileURL}`;
    res.download(file); 
    res.redirect(`/admin/enquiries/replyEnquiries/${req.params.id}`)
});

module.exports = router;