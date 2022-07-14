const db = require('../config/DBConfig');
const sequelize = require('sequelize');

class Product extends sequelize.Model {}

Product.init({
  // Model attributes are defined here
  prod_name: {
    type: sequelize.STRING,
    unique: 'prod_name',
    allowNull: false
  },
  prod_desc: {
    type: sequelize.STRING
  },
  difficulty: {
    type: sequelize.STRING,
    allowNull: false
  },
  stock: {
    type: sequelize.INTEGER,
    allowNull: false
  },
  price: {
    type: sequelize.DECIMAL,
    allowNull: false
  }
  
}, {
  // Other model options go here
  sequelize: db, // We need to pass the connection instance
  modelName: 'Product' // We need to choose the model name
});

module.exports = Product;