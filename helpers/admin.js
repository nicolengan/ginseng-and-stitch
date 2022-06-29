const express = require('express');
const User = require('../models/User');
const flashMessage = require('../helpers/messenger');

const isAdmin = (req, res, next) => {
    // Check if the requesting user is marked as admin in database
    if (req.isAuthenticated()) {
        if (req.user.role == "admin") {
            return next();
        }
        else if (req.user.role == null) {
            res.redirect('/account/login');
        }
    }
    flashMessage(res, 'error', 'Cannot access admin page, please login and try again');
    res.redirect('/account/login');
}
module.exports = isAdmin;
