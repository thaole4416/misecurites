// "use strict";
// const nodemailer = require("nodemailer");

// // async..await is not allowed in global scope, must use a wrapper
// async function main() {
//   // Generate test SMTP service account from ethereal.email
//   // Only needed if you don't have a real mail account for testing
//   let testAccount = await nodemailer.createTestAccount();

//   // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: testAccount.user, // generated ethereal user
//       pass: testAccount.pass, // generated ethereal password
//     },
//   });

//   // send mail with defined transport object
//   let info = await transporter.sendMail({
//     from: '"Fred Foo 👻" <foo@example.com>', // sender address
//     to: "ledinhthao131098@gmail.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
//   });

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//   // Preview only available when sending through an Ethereal account
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
// }

// main().catch(console.error);

var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");


function sendMailOtpCode(sendTo, otpCode, response) {
  var transporter = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_SECRET,
      },
    })
  );
  console.log(process.env.GMAIL_EMAIL)
  console.log(process.env.GMAIL_SECRET)
  var mailOptions = {
    from: "misecurities@gmail.com",
    to: sendTo,
    subject: "Sending Email using Node.js[nodemailer]",
    text: `Mật khẩu OTP của quý khách là ${otpCode}. `,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      transporter.close();
      response.json({status: "FAIL",message: ""})
    } else {
      console.log("Email sent: " + info.response);
      transporter.close();
      response.json({status: "OK",message: "Mật khẩu OTP đã được gửi đến mail của quý khách!"})
    }
  });
}

module.exports = {
  sendMailOtpCode: sendMailOtpCode,
};
