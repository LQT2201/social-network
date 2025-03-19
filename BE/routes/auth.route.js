// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const authentication = require("../middlewares/auth.middleware");

// Endpoint đăng ký người dùng mới
router.post("/signup", AuthController.signUp);
router.post("/signin", AuthController.signIn);

router.use(authentication);
router.post("/logout", AuthController.logOut);
router.post("/handlerefreshtoken", AuthController.handleRefreshToken);

module.exports = router;
