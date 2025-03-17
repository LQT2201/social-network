// routes/userRoutes.js
const express = require("express");
const {
  registerUser,
  getUserProfile,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.get("/profile", authMiddleware, getUserProfile);

module.exports = router;
