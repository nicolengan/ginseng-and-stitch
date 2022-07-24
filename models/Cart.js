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

const cart = null;

module.exports = class Cart{

  static save(classes){

    if(cart){
      const existingClassIndex = cart.classes.findIndex(c => c.id == classes.id) // to check if class exist in cart
      console.log('existingClassesIndex: ', existingClassIndex);
      if (existingClassIndex > 0){
        const existingClass = cart.classes[existingClassIndex];
        existingClass.qty += 1;
        cart.pax = classes.pax;

      }else{ // doesn't exist
        classes.qty = 1;
        cart.classes.push(classes);
        cart.date = classes.date;
        cart.pax = classes.pax;
        cart.max_pax = classes.max_pax;
      }

    }else{

      cart = {classes : [], date: dd/mm/yyyy , pax: 0, max_pax: 5};

      classes.qty = 1;
      cart.classes.push(classes);
      cart.date = classes.date;
      cart.pax = classes.pax;
      cart.max_pax = classes.max_pax;
    }
  }

  static getCart(){
    return cart;
  }
}