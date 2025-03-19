// routes.js
const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.route");

// Routes
router.use("/api/auth", authRoutes);

module.exports = router;
