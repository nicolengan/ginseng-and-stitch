const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const moment = require('moment');

// moment.suppressDeprecationWarnings = true;
//booking id, course id, class id, instructor id, user id, date created

// Create booking table in MySQL Database
const Bookings = db.define('booking',
    {
        name: { type: Sequelize.STRING(2000) },
        course_id: { type: Sequelize.INTEGER },
        class_id: { type: Sequelize.INTEGER },
        difficulty: { type: Sequelize.STRING(2000) },
        price: { type: Sequelize.INTEGER},
        // date: { type: Sequelize.DATE },
        time: { type: Sequelize.TIME },
        instructor_id: { type: Sequelize.INTEGER },
        instructor_name: { type: Sequelize.STRING }
    }
);

module.exports = Bookings;