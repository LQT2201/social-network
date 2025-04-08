const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const authentication = require("../middlewares/auth.middleware");
const { uploadCloud } = require("../config/cloudinary.config");

// Apply authentication to all routes
router.use(authentication);

// User routes
router.get("/recommend", UserController.getRecommendUsers);
router.get("/current", UserController.getCurrentUser);
router.get("/search", UserController.searchUsers);
router.get("/all", UserController.getAllUsers);
router.get("/following", UserController.getFollowingUsers);
router.get("/follow-status/:targetUserId", UserController.checkFollowStatus);
router.get("/:userId", UserController.getUserById);

// Profile routes
router.put(
  "/:userId/profile",
  uploadCloud.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  UserController.updateProfile
);

// Follow routes
router.post("/:userId/follow", UserController.followUser);
router.delete("/:userId/follow", UserController.unfollowUser);
router.get("/:userId/followers", UserController.getFollowers);
router.get("/:userId/following", UserController.getFollowing);

// Status routes
router.patch("/:userId/status", UserController.updateUserStatus);

module.exports = router;
