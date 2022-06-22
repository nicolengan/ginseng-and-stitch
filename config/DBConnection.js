const mySQLDB = require('./DBConfig');
const User = require('../models/User');
const Classes = require('../models/Classes');

// If drop is true, all existing tables are dropped and recreated 
const setUpDB = (drop) => {
    mySQLDB.authenticate()
        .then(() => {
            console.log('Database connected');
            /* 
            Defines the relationship where a user has many videos. 
            The primary key from user will be a foreign key in video. 
            */
            mySQLDB.sync({
                force: drop
            });
        })
        .catch(err => console.log(err));
};

module.exports = { setUpDB };