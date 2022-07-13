const db = require('../config/DBConfig');
const sequelize = require('sequelize');

class Class extends sequelize.Model {}

Class.init({
  // Model attributes are defined here
  date: {
    type: sequelize.DATEONLY,
    allowNull: false
  },
  pax: {
    type: sequelize.INTEGER
  },
  max_pax: {
    type: sequelize.INTEGER,
    allowNull: false
  }
  
}, {
  // Other model options go here
  sequelize: db, // We need to pass the connection instance
  modelName: 'Class' // We need to choose the model name
});

module.exports = Class;