const mySQLDB = require('./DBConfig');
const User = require('../models/User');
const Classes = require('../models/Classes');
const Bookings = require('../models/Booking');
const Courses = require('../models/courses');

const setUpDB = (drop) => {
    mySQLDB.authenticate()
        .then(() => {
            console.log('Database connected');

           //User and Classes Linkage
           User.hasMany(Classes);
           Classes.belongsTo(User);
           
        //    //Courses and Classes Linkage
        //    Courses.hasMany(Classes);
        //    Classes.belongsTo(Courses);
        
           //Booking linkage to Classes and User
           User.hasMany(Bookings); 
           Classes.hasMany(Bookings);
           Bookings.belongsTo(Classes);
           Bookings.belongsTo(User);

           mySQLDB.sync({ 
                force: drop 
            }); 
        }) 
        .catch(err => console.log(err)); 
}; 
    
module.exports = { setUpDB };