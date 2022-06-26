const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// Create videos table in MySQL Database
const Courses = db.define('courses',
{
title: { type: Sequelize.STRING },
uuid: { type: Sequelize.STRING },
Description: { type: Sequelize.STRING(2000) },
price: { type: Sequelize.INTEGER },
});
module.exports = Courses;