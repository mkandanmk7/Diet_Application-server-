const nodemailer = require("nodemailer");

const sendMail = async (email, subject, link) => {
  try {
    let transporter = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAILER_USERNAME,
        pass: process.env.MAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: "muthutest789@gmail.com",
      to: email,
      subject: subject,
      html: link,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.log("email error" + err);
      }
    });
  } catch (err) {
    console.log("error in email sending", err);
  }
};

module.exports = sendMail;
