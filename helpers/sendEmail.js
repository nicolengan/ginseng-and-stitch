const nodemailer = require("nodemailer");
function sendEmail(email, subject, message) {
    let mail = nodemailer.createTransport({
        // service: 'gmail',
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: 'ginsengandstitch@gmail.com', // Your email id
            pass: 'szuhchynibnlqpjz' // Your password
        }
    });
    var mailOptions = {
        from: 'ginsengandstitch@gmail.com',
        to: email,
        // subject: 'Reset Password Link - Ginseng and stitch',
        subject: subject,
        // html: '<p>You requested for reset password, kindly use this <a href="http://localhost:5000/account/resetPassword?token=' + token + '">link</a> to reset your password</p>'
        html: message
    };
    mail.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log(info)
        }
    });
}

module.exports = sendEmail;