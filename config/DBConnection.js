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
            console.log("The table for the Database was just (re)created!");

            //user_id in cart
            Cart.belongsTo(User);
            User.hasOne(Cart);

            //product_id in cart
            Cart.belongsTo(Product);
            Product.hasMany(Cart);

            //booking_id in cart
            Cart.hasMany(Booking);
            Booking.belongsTo(Cart);
            
            // Course_id in class
            Class.belongsTo(Course, {foreignKey: 'CourseId', targetKey: 'id', onDelete: 'CASCADE'});
            Course.hasMany(Class, {foreignKey: 'CourseId', onDelete: 'CASCADE'});

            //User_id in Booking
            User.hasMany(Booking);
            Booking.belongsTo(User);

            //Class_id in Booking
            Class.hasMany(Booking);
            Booking.belongsTo(Class);

            //Cart_id in Booking
            Booking.belongsTo(Cart);
            Cart.hasOne(Booking);
            
            //Course_id in Booking
            Course.hasMany(Booking);
            Booking.belongsTo(Course);

        })
        .catch(err => console.log(err));
};

module.exports = { setUpDB };