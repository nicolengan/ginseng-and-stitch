const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');
const mySQLDB = require('./DBConfig');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Class = require('../models/Class');
const Course = require('../models/Course');

const setUpDB = (drop) => {

    mySQLDB.authenticate()
        .then(() => {
            console.log('Database connected');

            mySQLDB.sync({ alter: true, force: drop });
            console.log("The table for the was just (re)created!");

            // Cart.belongsTo(User);
            // Cart.hasMany(Product);
            // Cart.hasOne(Booking);

            Course.hasMany(Class);
            Class.belongsTo(Course);

            User.hasMany(Booking);
            Booking.belongsTo(Class);

        })
        .catch(err => console.log(err));
};

module.exports = { setUpDB };