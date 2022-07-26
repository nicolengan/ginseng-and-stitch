const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const flashMessage = require('../helpers/messenger');


router.get('/', (req, res) => {
    res.render('admin/enquiries/listEnquiries');
});

router.get('/api/list', async (req, res) => {
    return res.json({
        total: await User.count(),
        rows: await User.findAll()
    })
});

// router.get('/editUser/:id', (req, res) => {
//     console.log(JSON.stringify(req.body));
//     let name = req.body.name;
//     let email = req.body.email;
//     console.log(name);
//     console.log(email);
//     User.update({ name, email}, { where: { id: req.params.id } })
//         .then((result) => {
//             console.log(result[0] + ' account updated');
//             res.redirect('/account');
//         })
//         .catch(err => console.log(err));
// });

router.get('/deleteUser/:id', async (req, res) => {
    let enquiries = await User.findOne({ where: { id: req.params.id } })
        try {
            await enquiries.destroy()
                .then((result) => {
                    console.log(enquiries + ' deleted');
                    res.redirect('/admin/enquiries');
                })
                .catch(err => console.log(err));
        }
        catch (err) {
            console.log(err);
        }
});
module.exports = router;