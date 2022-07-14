<<<<<<< HEAD
=======

>>>>>>> 0d535deb3f4e6439b12b23fa84575d341729c333
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
            User.hasOne(Cart);

            Cart.belongsTo(Product);
            Product.hasMany(Cart);

            Booking.belongsTo(Cart);
            Cart.hasOne(Booking);

            Class.belongsTo(Course);
            Course.hasMany(Class);

            User.hasMany(Booking);
            Booking.belongsTo(User);

            Class.hasMany(Booking);
            Booking.belongsTo(Class);

            Course.hasMany(Booking);
            Booking.belongsTo(Course);

        })
        .catch(err => console.log(err));
};

module.exports = { setUpDB };