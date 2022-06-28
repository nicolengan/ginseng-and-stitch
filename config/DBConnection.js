const mySQLDB = require('./DBConfig');
const User = require('../models/User');
const Classes = require('../models/Classes');
const Bookings = require('../models/Booking');
const Courses = require('../models/Courses');

const setUpDB = (drop) => {
    mySQLDB.authenticate()
        .then(() => {
            console.log('Database connected');
           User.hasMany(Classes);
           Classes.belongsTo(User);
        
           // to allow Booking to get User and Classes id
           User.hasMany(Bookings); 
           Classes.hasMany(Bookings);
           Bookings.belongsTo(Classes);
           Bookings.belongsTo(User);
        //    User.hasMany(Booking);
        //    Booking.belongsTo(User);
        //    Booking.belongsTo(Classes);
        
           mySQLDB.sync({ 
                force: drop 
            }); 
        }) 
        .catch(err => console.log(err)); 
}; 
    
module.exports = { setUpDB };