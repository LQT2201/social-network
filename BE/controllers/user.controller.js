// controllers/userController.js
const User = require("../models/user.model");

// Đăng ký người dùng mới
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: "Error registering user" });
  }
};

// Lấy thông tin người dùng
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: "Error fetching user profile" });
  }
};

module.exports = { registerUser, getUserProfile };
