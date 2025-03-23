// routes/userRoutes.js
const express = require("express");
const {
  registerUser,
  getUserProfile,
} = require("../controllers/user.controller");
const authentication = require("../middlewares/auth.middleware");

const router = express.Router();
router.use(authentication);
router.post("/register", registerUser);
router.get("/profile", getUserProfile);

module.exports = router;
