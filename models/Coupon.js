const db = require('../config/DBConfig');
const sequelize = require('sequelize');

class Coupon extends sequelize.Model {}

Coupon.init({
  // Model attributes are defined here
  percentage: { 
    type: sequelize.DECIMAL,
    allowNull: false
  },
  coupon: {
    type: sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  }
}, {
  // Other model options go here
  sequelize: db, // We need to pass the connection instance
  modelName: 'Coupon' // We need to choose the model name
});


module.exports = Coupon;