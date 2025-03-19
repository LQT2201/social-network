// controllers/authController.js
const { SuccessResponse } = require("../core/success.response");
const AuthService = require("../services/auth.service");

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
      const result = await AuthService.signIn({ email, password });

      if (result.metadata) {
        return res.status(result.code).json(result.metadata);
      } else {
        return res.status(400).json({ message: "Đăng nhập thất bại" });
      }
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
      console.log("sfesd");

      const refreshToken = req.body.refreshToken;

      new SuccessResponse({
        message: "Get token success",
        metadata: await AuthService.handleRefreshToken(refreshToken),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = AuthController;
