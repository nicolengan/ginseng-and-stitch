const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const moment = require('moment');

// moment.suppressDeprecationWarnings = true;

// Create classes table in MySQL Database
const Classes = db.define('classes',
    {
        course_id: { type: Sequelize.INTEGER },
        instructor_id: { type: Sequelize.INTEGER },
        name: { type: Sequelize.STRING(2000) },
        difficulty: { type: Sequelize.STRING(2000) },
        time: { type: Sequelize.TIME },
        dateClasses: { type: Sequelize.DATE },
        class_no: { type: Sequelize.INTEGER },
        pax: { type: Sequelize.INTEGER }
    }
);

module.exports = Classes;