const db = require('../config/DBConfig');
const sequelize = require('sequelize');

class Enquiry extends sequelize.Model {}

Enquiry.init({
  // Model attributes are defined here
  name: {
    type: sequelize.STRING,
    allowNull: false
  },
  email: {
    type: sequelize.STRING,
    allowNull: false
  },
  subject: {
    type: sequelize.STRING,
    allowNull: false
  },
  comments: {
    type: sequelize.TEXT,
    allowNull: false
  },
  fileURL: {
    type: sequelize.STRING
  },
  status: {
    type: sequelize.BOOLEAN,
    defaultValue: 0,
    allowNull: false
  },
  reply: {
    type: sequelize.TEXT,
  }
  
}, {
  // Other model options go here
  sequelize: db, // We need to pass the connection instance
  modelName: 'Enquiry' // We need to choose the model name
});

module.exports = Enquiry;