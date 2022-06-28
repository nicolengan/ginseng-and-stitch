const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const moment = require('moment');

// moment.suppressDeprecationWarnings = true;

// Create classes table in MySQL Database
const Classes = db.define('classes',
    {
        course_id: { type: Sequelize.INTEGER },
        instructor_name: { type: Sequelize.STRING(2000) },
        course_name: { type: Sequelize.STRING(2000) },
        course_difficulty: { type: Sequelize.STRING(2000) },
        course_price: { type: Sequelize.INTEGER},
        time: { type: Sequelize.TIME },
        dateClasses: { type: Sequelize.DATE },
        class_no: { type: Sequelize.INTEGER },
        pax: { type: Sequelize.INTEGER }
    }
);

module.exports = Classes;