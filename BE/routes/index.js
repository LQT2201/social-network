// routes.js
const express = require("express");
const router = express.Router();

// Import routes
const authRoutes = require("./auth.route");
const postRoutes = require("./post.route");
const commentRoutes = require("./comment.route");
const notificationRoutes = require("./notification.route");
const chatRoutes = require("./chat.route");
const userRoutes = require("./user.route");
const messageRoutes = require("./message.route"); // Add this line

// Auth routes
router.use("/api/auth", authRoutes);

// Protected routes
router.use("/api/posts", postRoutes);
router.use("/api/comments", commentRoutes);
router.use("/api/notifications", notificationRoutes);
router.use("/api/chats", chatRoutes);
router.use("/api/users", userRoutes);
router.use("/api/messages", messageRoutes); // Add this line

// Error handler for undefined routes
router.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

module.exports = router;
