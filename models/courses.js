const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// Create videos table in MySQL Database
const Courses = db.define('courses',
{
id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
title: { type: Sequelize.STRING },
uuid: { type: Sequelize.STRING },
Description: { type: Sequelize.STRING(2000) },
price: { type: Sequelize.INTEGER },
difficulty: {type: Sequelize.ENUM('basic','intermediate','advanced'), defaultValue : 'basic'}
});
module.exports = Courses;