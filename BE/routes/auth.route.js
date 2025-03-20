// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const authentication = require("../middlewares/auth.middleware");
const passport = require("passport");

// Endpoint đăng ký người dùng mới
router.post("/signup", AuthController.signUp);
router.post("/signin", AuthController.signIn);
// Route đăng nhập với Google
router.get("/google", AuthController.googleLogin);

// Route callback sau khi Google xác thực
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  AuthController.googleCallback
);

// Route quên mật khẩu
router.post("/forgot-password", AuthController.forgotPassword); // Gửi OTP
router.post("/reset-password", AuthController.resetPassword); // Xác thực OTP và đặt lại mật khẩu

router.use(authentication);
router.post("/logout", AuthController.logOut);
router.post("/handlerefreshtoken", AuthController.handleRefreshToken);

module.exports = router;
