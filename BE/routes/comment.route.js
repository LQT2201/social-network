const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/comment.controller");
const authentication = require("../middlewares/auth.middleware");

// All routes require authentication
router.use(authentication);

// Create comment on post
router.post("/posts/:postId/comments", CommentController.createComment);

// Create reply to comment
router.post("/comments/:commentId/reply", CommentController.createReply);

// Like/unlike comment
router.post("/comments/:commentId/like", CommentController.likeComment);

module.exports = router;
