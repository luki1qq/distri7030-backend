"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendEmail = void 0;

var _nodemailer = _interopRequireDefault(require("nodemailer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// export const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.MAIL_USERNAME,
//     pass: process.env.MAIL_PASSWORD
//   }
// })
var sendEmail = function sendEmail(email, subject, message) {
  var transport = _nodemailer["default"].createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD
    }
  });

  var mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: email,
    subject: subject,
    html: message
  };
  transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } // console.log("email sent" + info.response)

  });
};

exports.sendEmail = sendEmail;