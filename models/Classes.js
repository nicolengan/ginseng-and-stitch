const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const moment = require('moment');

moment.suppressDeprecationWarnings = true;

// Create classes table in MySQL Database
const Classes = db.define('classes',
    {
        class_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        course_id: { type: Sequelize.INTEGER, primaryKey: true },
        instructor_id: { type: Sequelize.INTEGER },
        name: { type: Sequelize.STRING  },
        difficulty: { type: Sequelize.STRING },
        time: { type: Sequelize.TIME },
        date: { type: Sequelize.DATE },
        class_no: { type: Sequelize.INTEGER },
        pax: { type: Sequelize.INTEGER }
    }
);

module.exports = Classes;