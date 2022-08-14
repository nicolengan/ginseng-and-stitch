const db = require('../config/DBConfig');
const sequelize = require('sequelize');

class Traffic extends sequelize.Model {}

Traffic.init({
  // Model attributes are defined here
  month: {
    type: sequelize.STRING,
    allowNull: false
  },
  year: {
    type: sequelize.STRING,
    allowNull: false,
  },
  count: {
    type: sequelize.INTEGER,
    defaultValue: 0,
  }

}, {
   // Other model options go here
   sequelize: db, // We need to pass the connection instance
   modelName: 'Traffic' // We need to choose the model name
});

module.exports = Traffic;