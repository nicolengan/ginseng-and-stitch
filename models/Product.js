const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
// Create users table in MySQL Database
const Product = db.define('product',
{
prod_name: { type: Sequelize.STRING },
prod_desc: { type: Sequelize.STRING(2000) },
difficulty: { type: Sequelize.STRING },
quantity: { type: Sequelize.INTEGER }
});
module.exports = Product;