const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.warn("WARNING: SMTP credentials (EMAIL_USER and EMAIL_PASS) are not configured in .env. Email notification skipped.");
    return;
  }

  let transporter;

  if (process.env.EMAIL_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587", 10),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  } else {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  }

  const mailOptions = {
    from: `"Inbound Query Portal" <${emailUser}>`,
    to: "muralidharan18898@gmail.com",
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
