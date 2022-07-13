const db = require('../config/DBConfig');
const sequelize = require('sequelize');

class Booking extends sequelize.Model {}

Booking.init({
  // Model attributes are defined here
}, {
  // Other model options go here
  sequelize: db, // We need to pass the connection instance
  modelName: 'Booking' // We need to choose the model name
});

module.exports = Booking;