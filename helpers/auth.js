const flashMessage = require('../helpers/messenger');
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    flashMessage(res, 'error', 'Not logged in, please log in and try again.');
    res.redirect('/user/login');
};
module.exports = ensureAuthenticated;