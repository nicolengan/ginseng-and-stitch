// const Sequelize = require('sequelize');
// const db  = require('../config/DBConfig');

// // Create users table in MySQL Database
// const User = db.define('user',
//     {
//         name: { type: Sequelize.STRING },
//         email: { type: Sequelize.STRING },
//         password: { type: Sequelize.STRING }
//     });

// module.exports = User;

const { DataTypes, Model, Sequelize } = require('sequelize');

class User extends Model {
    /**
     * Initialize the tables
     * @param {Sequelize} orm 
     */
    static initialize(orm) {
        User.init({
            name:     { type: DataTypes.STRING },
            email:    { type: DataTypes.STRING },
            password: { type: DataTypes.STRING },
            role: { 
                type: DataTypes.STRING,
                defaultValue: 'user' }
        }, {
            sequelize: orm
        });
    }
    
    /**
     * 
     * @param {string} new_password 
     */
    change_password(new_password) {
        this.password = new_password;
    }
}
module.exports = { User };