const db = require('../config/DBConfig');
const sequelize = require('sequelize');

class Course extends sequelize.Model {}

Course.init({
  // Model attributes are defined here
  title: {
    type: sequelize.STRING,
    unique: 'title',
    allowNull: false
  },
  description: {
    type: sequelize.STRING
  },
  price: {
    type: sequelize.DECIMAL,
    allowNull: false
  },
  level: {
    type: sequelize.STRING,
    allowNull: false
  }
  
}, {
  // Other model options go here
  sequelize: db, // We need to pass the connection instance
  modelName: 'Course' // We need to choose the model name
});

module.exports = Course;