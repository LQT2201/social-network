const nodemailer = require("nodemailer");
const { getEmailTemplate } = require("../utils/otp.util");

// Tạo transporter để gửi email
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Hàm gửi email
const sendEmail = async (to, subject, templateName, replacements) => {
  try {
    // Lấy template HTML
    const html = getEmailTemplate(templateName, replacements);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = { sendEmail };
