const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
const bcrypt = require('bcryptjs');
const flashMessage = require('../helpers/messenger');
const sendEmail = require('../helpers/sendEmail');


router.get('/', (req, res) => {
    res.render('admin/enquiries/listEnquiries');
});

router.get('/api/list', async (req, res) => {
    return res.json({
        total: await Enquiry.count(),
        rows: await Enquiry.findAll( {order: ['status']})
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
            var message = `<p>Hello, ${enquiry.name},<br> thank you for contacting us. Hello, ${enquiry.name},<br> thank you for contacting us. ${reply}</p>`
            var email = enquiry.email
            sendEmail(email, subject, message);
            console.log(result + ' reply sent.');
            res.redirect('/admin/enquiries');
        })
        .catch(err => console.log(err));
});

router.get('/deleteEnquiries/:id', async (req, res) => {
    let enquiry = await Enquiry.findOne({ where: { id: req.params.id } })
        try {
            await enquiry.destroy()
                .then((result) => {
                    console.log(enquiry + ' deleted');
                    flashMessage(res, 'success', 'Enquiry deleted')
                    res.redirect('/admin/enquiries');
                    
                })
                .catch(err => console.log(err));
        }
        catch (err) {
            console.log(err);
        }
});

router.get('/download/:id', async (req, res) =>{
    let enquiry = await Enquiry.findOne({ where: { id: req.params.id } })
    const file = `./public${enquiry.fileURL}`;
    res.download(file); 
});

module.exports = router;