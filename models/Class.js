const db = require('../config/DBConfig');
const { sequelize, Model, DataTypes } = require('sequelize');

class Class extends Model {}

Class.init({
  // Model attributes are defined here
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    unique: 'date'
  },
  pax: {
    type: DataTypes.INTEGER
  },
  max_pax: {
    type: DataTypes.INTEGER
    // allowNull: false
  }
}, {
   // Other model options go here
   sequelize: db, // We need to pass the connection instance
   modelName: 'Class' // We need to choose the model name
});
module.exports = Class;