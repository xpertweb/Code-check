const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');


  export  function sendEmail(app,email) {
    return app.service('mailer').create(email).then(function (result) {
      console.log('Sent email', result);
    }).catch(err => {
      console.log('Error sending email', err);
    });
  }


  export function sendEmailWithAttachments(email) {

    const transporter = nodemailer.createTransport(smtpTransport({
      host: 'email-smtp.us-east-1.amazonaws.com',
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    }));
    return transporter.sendMail(email)
  }