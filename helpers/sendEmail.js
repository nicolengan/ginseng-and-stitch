const randtoken = require('rand-token');
const nodemailer = require("nodemailer");

function sendEmail(email, token) {
    var email = email;
    var token = token;
    let mail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ginsengandstitch@gmail.com', // Your email id
            pass: 'Ginseng1!' // Your password
        }
    });
    var mailOptions = {
        from: 'ginsengandstitch@gmail.com',
        to: email,
        subject: 'Reset Password Link - Tutsmake.com',
        html: '<p>You requested for reset password, kindly use this <a href="http://localhost:4000/reset-password?token=' + token + '">link</a> to reset your password</p>'
    };
    mail.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(1)
        } else {
            console.log(0)
        }
    });
}
module.exports = flashMessage;