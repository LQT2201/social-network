const { SuccessResponse } = require("../core/success.response");
const AuthService = require("../services/auth.service");
const passport = require("passport");
const OTPService = require("../services/otp.service");
const User = require("../models/user.model");

class AuthController {
  static signUp = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const result = await AuthService.signUp({ username, email, password });

      if (result.metadata) {
        return res.status(result.code).json(result.metadata);
      } else {
        return res.status(400).json({ message: "Đăng ký thất bại" });
      }
    } catch (error) {
      next(error);
    }
  };

  static signIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      new SuccessResponse({
        message: "Đăng nhập thành công",
        metadata: await AuthService.signIn({ email, password }),
      }).send(res);
      // Nếu có lỗi thì trả về thông báo lỗi
    } catch (error) {
      next(error);
    }
  };

  static logOut = async (req, res, next) => {
    try {
      const userId = req.body.userId;

      new SuccessResponse({
        message: "Logout success",
        metadata: await AuthService.logOut(userId),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  static handleRefreshToken = async (req, res, next) => {
    try {
      const refreshToken = req.body.refreshToken;

      new SuccessResponse({
        message: "Get token success",
        metadata: await AuthService.handleRefreshToken(refreshToken),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  // Route to start Google login process
  static googleLogin = (req, res, next) => {
    passport.authenticate("google", { scope: ["profile", "email"] })(
      req,
      res,
      next
    );
  };

  // Callback after Google login
  static googleCallback = async (req, res, next) => {
    console.log("req.user:", req.user); // Kiểm tra req.user

    try {
      if (!req.user) {
        return res.status(400).json({ message: "User not found in request" });
      }

      const result = await AuthService.googleCallback(req.user);

      res.cookie("accessToken", result.tokens.accessToken, {
        httpOnly: false,
        secure: false,
      });

      res.cookie("refreshToken", result.tokens.refreshToken, {
        httpOnly: false,
        secure: false,
      });
      return res.redirect(`http://localhost:3000/signin`);
    } catch (error) {
      next(error);
    }
  };

  // Gửi OTP để quên mật khẩu
  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      // Gọi service để gửi OTP
      const result = await OTPService.sendOTP(email);

      // Trả về kết quả
      new SuccessResponse({
        message: "OTP sent successfully",
        metadata: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  // Xác thực OTP và đặt lại mật khẩu
  static async resetPassword(req, res, next) {
    try {
      const { email, otp, newPassword } = req.body;

      // Xác thực OTP
      await OTPService.verifyOTP(email, otp);

      // Tìm người dùng và cập nhật mật khẩu
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }

      user.password = newPassword;
      await user.save();

      // Trả về kết quả
      new SuccessResponse({
        message: "Password reset successfully",
      }).send(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
