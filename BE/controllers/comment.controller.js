const { SuccessResponse } = require("../core/success.response");
const CommentService = require("../services/comment.service");

class CommentController {
  static async createComment(req, res, next) {
    try {
      const { content } = req.body;
      const { postId } = req.params;

      const comment = await CommentService.createComment(
        req.userId,
        postId,
        content
      );

      new SuccessResponse({
        message: "Comment created successfully",
        metadata: comment,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async createReply(req, res, next) {
    try {
      const { content } = req.body;
      const { commentId } = req.params;

      const reply = await CommentService.createReply(
        req.userId,
        commentId,
        content
      );

      new SuccessResponse({
        message: "Reply created successfully",
        metadata: reply,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async likeComment(req, res, next) {
    try {
      const { commentId } = req.params;

      const comment = await CommentService.likeComment(req.userId, commentId);

      new SuccessResponse({
        message: "Comment like updated successfully",
        metadata: comment,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async getPostComments(req, res, next) {
    try {
      console.log("Fetching comments for post:");

      const { postId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const comments = await CommentService.getPostComments(
        postId,
        parseInt(page),
        parseInt(limit)
      );

      new SuccessResponse({
        message: "Comments retrieved successfully",
        metadata: comments,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CommentController;
