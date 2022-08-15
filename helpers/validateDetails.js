const flashMessage = require('../helpers/messenger');
const validator = require("email-validator");
function validateDetails(res, isValid, password, password2, email) {

    if (password.length < 6) {
        flashMessage(res, 'error', 'Password must be at least 6 characters');
        isValid = false;
    }
    if (password != password2) {
        flashMessage(res, 'error', 'Passwords do not match');
        valid = false;
    }
    if (email != undefined) {
        if (!validator.validate(email)) {
            flashMessage(res, 'error', 'Email is not in a valid format (name@email.com), please try again.');
            isValid = false;
        }
    }
    return isValid
}
module.exports = validateDetails;