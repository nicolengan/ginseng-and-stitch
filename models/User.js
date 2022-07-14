const db = require('../config/DBConfig');
const sequelize = require('sequelize');

class User extends sequelize.Model {}

User.init({
  // Model attributes are defined here
  name: {
    type: sequelize.STRING,
    unique: 'name',
    allowNull: false
    
  },
  email: {
    type: sequelize.STRING
  },
  role: {
    type: sequelize.CHAR,
    defaultValue: 'u',
  },
  password: {
    type: sequelize.STRING
  }
  
}, {
  // Other model options go here
  sequelize: db, // We need to pass the connection instance
  modelName: 'User' // We need to choose the model name
});

module.exports = User;