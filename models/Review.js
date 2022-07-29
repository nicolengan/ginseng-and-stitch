const db = require('../config/DBConfig');
const sequelize = require('sequelize');

class Review extends sequelize.Model {}

Review.init({
  // Model attributes are defined here
  star_count: {
    type: sequelize.INTEGER
  },
  review: {
    type: sequelize.STRING(102400)
  }

}, {
   // Other model options go here
   sequelize: db, // We need to pass the connection instance
   modelName: 'Review' // We need to choose the model name
});

module.exports = Review;