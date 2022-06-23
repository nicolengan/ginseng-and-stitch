const mySQLDB = require('./DBConfig');
const User = require('../models/User');
const Classes = require('../models/Classes');

const setUpDB = (drop) => {
    mySQLDB.authenticate()
        .then(() => {
            console.log('Database connected');
           User.hasMany(Classes);
           Classes.belongsTo(User);
           mySQLDB.sync({ 
                force: drop 
            }); 
        }) 
        .catch(err => console.log(err)); 
}; 
    
module.exports = { setUpDB };