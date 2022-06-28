const mySQLDB = require('./DBConfig');
const User = require('../models/User');
const Classes = require('../models/Classes');
const Booking = require('../models/Booking');
const Courses = require('../models/courses');

const setUpDB = (drop) => {
    mySQLDB.authenticate()
        .then(() => {
            console.log('Database connected');

           //User and Classes Linkage
           User.hasMany(Classes);
           Classes.belongsTo(User);

           // Booking linkage to User
           User.hasMany(Booking); 
           Booking.belongsTo(User);

        //    Courses and Classes Linkage
        //    Courses.hasMany(Classes);
        //    Classes.belongsTo(Courses);
        
        //    Booking linkage to Classes and User
        //    Classes.hasMany(Booking);
        //    Courses.hasMany(Booking);
        //    Booking.belongsTo(Classes);
        //    Booking.hasMany(Courses);

           mySQLDB.sync({ 
                force: drop 
            }); 
        }) 
        .catch(err => console.log(err)); 
}; 
    
module.exports = { setUpDB };