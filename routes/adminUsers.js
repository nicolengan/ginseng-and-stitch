const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const flashMessage = require('../helpers/messenger');


router.get('/', (req, res) => {
    res.render('admin/users/listUsers');
});

router.get('/api/list', async (req, res) => {
    return res.json({
        total: await User.count(),
        rows: await User.findAll()
    })
});

// router.get('/api/list/:id', async (req, res) => {
//     return res.json({
//         // total: await User.count(),
//         rows: await User.findOne({
//             where: { id: req.params.id },
//             raw: true
//         })
//     })
// });

router.get('/editUsers/:id', (req, res) => {
    User.findOne({
        where: { id: req.params.id },
        raw: true
    })
        .then((user) => {
            console.log(user)
            if (user == null) {
                res.redirect("/admin/user");
            }
            else {
                res.render("admin/users/editUsers", { user });
            }
        })

        .catch(err => console.log(err));
});

router.post('/editUsers/:id', (req, res) => {
    console.log(JSON.stringify(req.body));
    let { name, email, role } = req.body;
    let isValid = true;
    if (!isValid) {
        res.redirect('/admin/users');
        flashMessage(res, 'error', 'Not valid');
        console.log("failed")
        return;
    }
    try {
        User.update({ name, email, role }, { where: { id: req.params.id } })
            .then((result) => {
                console.log(result[0] + ' account updated');
                res.redirect('/admin/users');
            })
            .catch(err => console.log(err));
    }
    catch (err) {
        console.log(err);
    }
});

router.get('/deleteUser/:id', async (req, res) => {
    let user = await User.findOne({ where: { id: req.params.id } })
    if (user.email == "admin@gmail.com") {
        flashMessage(res, 'error', 'Unable to delete root admin account, please try again')
        res.redirect('/admin/users')
    }
    else {
        try {
            await user.destroy()
                .then((result) => {
                    console.log(user + ' deleted');
                    flashMessage(res, 'success', 'Account deleted')
                    res.redirect('/admin/users');

                })
                .catch(err => console.log(err));
        }
        catch (err) {
            console.log(err);
        }
    }
});

router.post('/addUser', async (req, res) => {
    let { name, email, password, password2, role } = req.body;

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
        res.redirect('/admin/users');
        flashMessage(res, 'error', 'Not valid');
        console.log("failed")
        return;
    }

    try {
        // If all is well, checks if user is already registered
        let user = await User.findOne({ where: { email: email } });
        if (user) {
            // If user is found, that means email has already been registered
            flashMessage(res, 'error', email + ' already registered');

        } else {
            // Create new user record 
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            // Use hashed password
            let user = await User.create({ name, email, password: hash, role });
            console.log(user, + "added")
            flashMessage(res, 'success', email + ' registered successfully');
            res.redirect('/admin/users');
        }
    } catch (err) {
        console.log(err);
    }
});
module.exports = router;