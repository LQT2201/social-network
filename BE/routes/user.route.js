// routes/userRoutes.js
const express = require("express");
const {
  registerUser,
  getUserProfile,
} = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", registerUser);
router.get("/profile", authMiddleware, getUserProfile);

module.exports = router;
