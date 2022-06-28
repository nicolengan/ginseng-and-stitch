const express = require('express');
const User = require('../models/User');

const isAdmin = (req, res, next) => {
    // Check if the requesting user is marked as admin in database
    if (req.user.role == "admin") {
        next();
    } else {
        res.redirect('/')
    }
}
module.exports =
    isAdmin;