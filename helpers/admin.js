const User = require('../models/User');

async function isAdmin(req, res, next) {
    // Check if the requesting user is marked as admin in database
    let admin = await User.findOne({
        where: {
            role: "admin"
        }
    })
    console.log(admin)
    if (admin) {
        next();
    } else {
        res.redirect('/search')
    }
}
module.exports = isAdmin;
