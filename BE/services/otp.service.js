const { sendEmail } = require("../config/nodemailer.config");
const { generateOTP } = require("../utils/otp.util");
const OtpModel = require("../models/otp.model"); // Model để lưu OTP

class OTPService {
  static async sendOTP(email) {
    try {
      // Tạo OTP (6 chữ số)
      const otp = generateOTP();

      // Nội dung email
      const subject = "Your OTP Code";
      const templateName = "email.template"; // Tên file template (không cần đuôi .html)
      const replacements = { otp }; // Các giá trị cần thay thế trong template

      // Gửi email
      await sendEmail(email, subject, templateName, replacements);

      // Lưu OTP vào database
      await OtpModel.create({
        email,
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
      }); // OTP hết hạn sau 5 phút

      return { success: true, message: "OTP sent successfully" };
    } catch (error) {
      throw error;
    }
  }

  static async verifyOTP(email, otp) {
    try {
      // Tìm OTP trong database

      const otpRecord = await OtpModel.findOne({ email, otp });

      if (!otpRecord) {
        throw new Error("Invalid OTP");
      }

      // Kiểm tra OTP đã hết hạn chưa
      if (otpRecord.expiresAt < Date.now()) {
        throw new Error("OTP has expired");
      }

      // Xóa OTP sau khi xác thực thành công
      await OtpModel.deleteOne({ email, otp });

      return { success: true, message: "OTP verified successfully" };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = OTPService;
