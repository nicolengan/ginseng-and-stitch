const db = require('../config/DBConfig');
const sequelize = require('sequelize');

class User extends sequelize.Model {}

User.init({
  // Model attributes are defined here
  name: {
    type: sequelize.STRING,
    allowNull: false
    
  },
  email: {
    type: sequelize.STRING,
    unique: 'email',
    allowNull: false
  },
  role: {
    type: sequelize.CHAR,
    defaultValue: 'u',
    allowNull: false
  },
  password: {
    type: sequelize.STRING,
    allowNull: false
  },
  token: {
    type: sequelize.STRING
  }
  
}, {
  // Other model options go here
  sequelize: db, // We need to pass the connection instance
  modelName: 'User' // We need to choose the model name
});

module.exports = User;