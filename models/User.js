const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// Create users table in MySQL Database
const User = db.define('user', {
    name: { type: Sequelize.STRING },
    uuid: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING },
    password: { type: Sequelize.STRING },
    admin: {type: Sequelize.BOOLEAN }
});

module.exports = User;