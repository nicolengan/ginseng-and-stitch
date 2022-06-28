"use strict";

const { Sequelize } = require("sequelize");
const { User  } = require('../models/User');

require('dotenv').config();

const ORM = new Sequelize(
    {
        dialect: 'sqlite', // Tells squelize that MySQL is used
        storage: "database.db3",
        logging: false,    // Disable logging; default: console.log
        pool: {
            max: 5, min: 0, acquire: 30000, idle: 10000
        }
    }
);

/**
 * If drop is true, all existing tables are dropped and recreated 
 * @param {boolean} drop 
 */
async function initialize_database(drop) {
    try {
        await ORM.authenticate();
        console.log('Database connected');
        /** Initialization */
        User.initialize(ORM);

        console.log('Tables initialized');
        /** 
         * Defines the relationship where a user has many videos. 
         * The primary key from user will be a foreign key in video. 
        **/
        // User.hasMany(Video);
        // Video.belongsTo(User);
        console.log('Relationship established');
        await ORM.sync({ force: drop });
        console.log('Database configured and ready');
    }
    catch (error) {
        console.log("Database failed to initialize", error);
    }
};

module.exports = { 
    initialize_database,
    ORM
};