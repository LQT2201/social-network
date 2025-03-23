const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/comment.controller");
const { authMiddleware } = require("../middlewares/auth");

// All routes require authentication
router.use(authMiddleware);

// Create comment on post
router.post("/posts/:postId/comments", CommentController.createComment);

// Create reply to comment
router.post("/comments/:commentId/reply", CommentController.createReply);

// Like/unlike comment
router.post("/comments/:commentId/like", CommentController.likeComment);

module.exports = router;
