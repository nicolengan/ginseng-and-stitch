const db = require('../config/DBConfig');
const sequelize = require('sequelize');

class Product extends sequelize.Model {}

Product.init({
  // Model attributes are defined here
  prod_name: {
    type: sequelize.STRING
  },
  prod_desc: {
    type: sequelize.STRING
  },
  difficulty: {
    type: sequelize.STRING
  },
  stock: {
    type: sequelize.INTEGER
  },
  price: {
    type: sequelize.DECIMAL
  }
  
}, {
  // Other model options go here
  sequelize: db, // We need to pass the connection instance
  modelName: 'Product' // We need to choose the model name
});

module.exports = Product;