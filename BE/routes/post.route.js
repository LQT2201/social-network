const express = require("express");
const router = express.Router();
const PostController = require("../controllers/post.controller");
const authentication = require("../middlewares/auth.middleware");

// Public routes
router.get("/", PostController.getPosts);

router.get("/:id", PostController.getPostById);

// Protected routes
router.use(authentication);

router.post(
  "/",

  PostController.createPost
);

router.put("/:id", PostController.updatePost);

router.delete("/:id", PostController.deletePost);

// Social interactions
router.post("/:id/like", PostController.likePost);

router.post("/:id/share", PostController.sharePost);

router.post("/:id/vote", PostController.voteInPoll);

module.exports = router;
