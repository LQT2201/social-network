const express = require("express");
const router = express.Router();
const PostController = require("../controllers/post.controller");
const { authMiddleware } = require("../middlewares/auth");
const { uploadCloud } = require("../middlewares/uploadCloud");

// Public routes
router.get("/", PostController.getPosts);

router.get("/:id", PostController.getPostById);

// Protected routes
router.use(authMiddleware);

router.post(
  "/",
  uploadCloud.array("media", 5), // Allow up to 5 files
  PostController.createPost
);

router.put("/:id", uploadCloud.array("media", 5), PostController.updatePost);

router.delete("/:id", PostController.deletePost);

// Social interactions
router.post("/:id/like", PostController.likePost);

router.post("/:id/share", PostController.sharePost);

router.post("/:id/vote", PostController.voteInPoll);

module.exports = router;
