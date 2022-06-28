const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const moment = require('moment');

// moment.suppressDeprecationWarnings = true;

// Create booking table in MySQL Database
const Bookings = db.define('booking',
    {
    }
);

module.exports = Bookings;