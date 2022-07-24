const Cart = require('../models/Cart');
const Class = require('../models/Class');

exports.addToCart = (req, res, next) => {
    const addedClass = Class.findById(req.body.id)[0];
    
    Cart.save(addedClass);
    console.log(Cart.getCart());
    res.end('saved successfully')
}