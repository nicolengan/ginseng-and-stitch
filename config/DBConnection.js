const mySQLDB = require('./DBConfig');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Class = require('../models/Class');
const Course = require('../models/Course');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Review = require('../models/Review');

const setUpDB = (drop) => {

    mySQLDB.authenticate()
        .then(() => {
            console.log('Database connected');

            mySQLDB.sync({ alter: true, force: drop });
            console.log("The table for the Database was just (re)created!");

            //user_id in cart
            Cart.belongsTo(User, {foreignKey: 'UserId', targetKey: 'id', onDelete: 'CASCADE'});
            User.hasOne(Cart, {sourceKey: 'id', foreignKey: 'UserId'});

            // product_id in cart
            Product.hasMany(Cart, { sourceKey: 'prod_name', foreignKey: 'prod_name'});
            // Product.hasMany(Cart, { sourceKey: 'posterURL', foreignKey: 'posterURL'});

            // //booking_id in cart
            // Cart.hasMany(Booking);
            // Booking.belongsTo(Cart);

            // Course_id in class

            // creates CourseId  foreign key in Class
            Class.belongsTo(Course, {foreignKey: 'CourseId', targetKey: 'id', onDelete: 'CASCADE'});
            Course.hasMany(Class, { sourceKey: 'id', foreignKey: 'CourseId'});

            //Class_id in Booking
            Booking.belongsTo(Class, {foreignKey: 'ClassId', targetKey: 'id'});
            Class.hasMany(Booking, {sourceKey: 'id', foreignKey: 'ClassId'});

            //Course_id in Booking
            Booking.belongsTo(Course, {foreignKey: 'CourseId', targetKey: 'id', onDelete: 'CASCADE'});
            Course.hasMany(Booking, {sourceKey: 'id', foreignKey: 'CourseId'});

            // User_id in Booking
            Booking.belongsTo(User, {foreignKey: 'UserId', targetKey: 'id', onDelete: 'CASCADE'});
            User.hasMany(Booking, {sourceKey: 'id', foreignKey: 'UserId'});

            Review.belongsTo(Course, {foreignKey : 'CourseId', targetKey :'id'});
            Course.hasMany(Review, {sourceKey: 'id', foreignKey: 'CourseId'});

            Review.belongsTo(User, {foreignKey: 'UserId', targetKey: 'id', onDelete: 'CASCADE'});
            User.hasMany(Review, {sourceKey: 'id', foreignKey: 'UserId'});

            // Cart_id in Booking
            // Booking.belongsTo(Cart, {foreignKey: 'CartId', targetKey: 'id', onDelete: 'CASCADE'});
            // Cart.hasOne(Booking, {sourceKey: 'id', foreignKey: 'CartId'});

        })
        .catch(err => console.log(err));
};

module.exports = { setUpDB };