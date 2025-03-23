// routes.js
const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.route");

// Routes
router.use("/api/auth", authRoutes);
router.use("/api", require("./notification.route"));
router.use("/api", require("./comment.route"));

module.exports = router;
