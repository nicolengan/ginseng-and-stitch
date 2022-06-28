const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const moment = require('moment');

// moment.suppressDeprecationWarnings = true;

//booking id, course id, class id, instructor id, user id, date created

// Create booking table in MySQL Database
const Bookings = db.define('booking',
    {
        course_id: { type: Sequelize.INTEGER },
        class_id: { type: Sequelize.INTEGER},
        instructor_id: { type: Sequelize.INTEGER }
    }
);

module.exports = Bookings;