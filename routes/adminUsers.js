const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const flashMessage = require('../helpers/messenger');


router.get('/', (req, res) => {
    res.render('admin/users/listUsers'
//     , {
//         whichPartial: function() {
//             return "_adminUser";
//        }
// }
);
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
    
    await User.destroy({ where: { id: req.params.id } })
        .then((result) => {
            console.log(result[0] + ' deleted');
            res.redirect('/admin/users');
        })
        .catch(err => console.log(err));
});

router.post('/addUser', async (req, res) => {
    let { name, email, password, password2, role} = req.body;

    let isValid = true;
    if (password.length < 6) {
        flashMessage(res, 'error', 'Password must be at least 6 characters');
        isValid = false;
    }
    if (password != password2) {
        flashMessage(res, 'error', 'Passwords do not match');
        isValid = false;
    }
    if (!isValid) {
        res.render('/admin/users', {
            name,
            email
        });
    }

    try {
        // If all is well, checks if user is already registered
        let user = await User.findOne({ where: { email: email } });
        if (user) {
            // If user is found, that means email has already been registered
            flashMessage(res, 'error', email + ' already registered');
            res.render('/admin/users', {
                name,
                email,
                whichPartial: function() {
                    return;
               }});
        } else {
            // Create new user record 
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            // Use hashed password
            let user = await User.create({ name, email, password: hash, role});
            flashMessage(res, 'success', email + ' registered successfully');
            res.redirect('/admin/users');
        }
    } catch (err) {
        console.log(err);
    }
});
module.exports = router;