// routes/userRoutes.js
const express = require("express");
const UserController = require("../controllers/user.controller");
const authentication = require("../middlewares/auth.middleware");

const router = express.Router();
router.use(authentication);

// Add the getCurrentUser route
router.get("/current", authentication, UserController.getCurrentUser);

module.exports = router;
