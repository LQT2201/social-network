const fs = require("fs");
const path = require("path");

const generateOTP = () => {
  // Tạo OTP gồm 6 chữ số
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Hàm đọc template HTML và thay thế placeholder
const getEmailTemplate = (templateName, replacements) => {
  const templatePath = path.join(
    __dirname,
    `../templates/${templateName}.html`
  );
  let template = fs.readFileSync(templatePath, "utf8");

  // Thay thế các placeholder bằng giá trị thực tế
  Object.keys(replacements).forEach((key) => {
    template = template.replace(
      new RegExp(`{{ ${key} }}`, "g"),
      replacements[key]
    );
  });

  return template;
};

module.exports = { generateOTP, getEmailTemplate };
