const db = require('../config/DBConfig');
const sequelize = require('sequelize');

class Code extends sequelize.Model {}

Code.init({
  // Model attributes are defined here
  code: {
    type: sequelize.STRING,
    unique: 'code',
    allowNull: false
  }
}, {
  // Other model options go here
  sequelize: db, // We need to pass the connection instance
  modelName: 'Code' // We need to choose the model name
});


module.exports = Code;