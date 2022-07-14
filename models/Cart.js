const db = require('../config/DBConfig');
const sequelize = require('sequelize');

class Cart extends sequelize.Model {}

Cart.init({
  // Model attributes are defined here
  quantity: {
    type: sequelize.INTEGER,
    allowNull: false
  },
  total: {
    type: sequelize.DECIMAL,
    defaultValue: 0.0,
    allowNull: false
  }
  
}, {
  // Other model options go here
  sequelize: db, // We need to pass the connection instance
  modelName: 'Cart' // We need to choose the model name
});

module.exports = Cart;