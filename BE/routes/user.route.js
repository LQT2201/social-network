const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const authentication = require("../middlewares/auth.middleware");

// Apply authentication to all routes
router.use(authentication);

// User routes
router.get("/current", UserController.getCurrentUser);
router.get("/search", UserController.searchUsers);
router.get("/all", UserController.getAllUsers);
router.get("/following", UserController.getFollowingUsers);
router.get("/follow-status/:targetUserId", UserController.checkFollowStatus);
router.get("/:userId", UserController.getUserById);

module.exports = router;
