const express = require("express");
const router = express.Router();
const PostController = require("../controllers/post.controller");
const authentication = require("../middlewares/auth.middleware");
const { uploadCloud } = require("../config/cloudinary.config");

// Public routes

// Protected routes
router.use(authentication);
router.get("/following", PostController.getFollowingPosts);
router.get("/:userId/user", PostController.getPostsByUser);
router.get("/:userId/liked", PostController.getPostsLiked);

router.get("/", PostController.getPosts);
router.get("/:id", PostController.getPostById);

// Create post with media upload
router.post(
  "/",
  uploadCloud.array("media", 5), // Handle multiple files, max 5
  PostController.createPost
);

router.put("/:id", PostController.updatePost);

router.delete("/:id", PostController.deletePost);

// Social interactions
router.post("/:id/like", PostController.likePost);

router.post("/:id/share", PostController.sharePost);

router.post("/:id/vote", PostController.voteInPoll);

module.exports = router;
