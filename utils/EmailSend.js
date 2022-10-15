const nodemailer = require("nodemailer");

const sendEmail = (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GOOGLE_APP_EMAIL,
      pass: process.env.GOOGLE_APP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GOOGLE_APP_EMAIL,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
  });
};

module.exports = sendEmail;
