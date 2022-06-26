const express = require('express');
const User = require('../models/User');

const isAdmin = (req, res, next) =>{
    // Check if the user is admin here
    // if admin, 
    User.findOne({
        where: { id: req.user.id },
        raw: true
    })
        .then((user) => {
            if (user.admin == true)
            {
                console.log(user);
                return next();
            }
            else
                res.redirect('/');
        })
        .catch(err => console.log(err));
}

module.exports = isAdmin;