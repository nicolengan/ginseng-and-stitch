const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');
const mySQLDB = require('./DBConfig');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Class = require('../models/Class');
const Course = require('../models/Course');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

const setUpDB = (drop) => {

    mySQLDB.authenticate()
        .then(() => {
            console.log('Database connected');

            mySQLDB.sync({ alter: true, force: drop });
            console.log("The table for the was just (re)created!");

            Cart.belongsTo(User);
            Product.hasMany(Cart);
            Booking.hasOne(Cart);

            Class.belongsTo(Course);

            User.hasMany(Booking);
            Class.hasMany(Booking)

        })
        .catch(err => console.log(err));
};

module.exports = { setUpDB };