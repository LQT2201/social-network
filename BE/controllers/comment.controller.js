const { SuccessResponse } = require("../core/success.response");
const CommentService = require("../services/comment.service");

class CommentController {
  static async createComment(req, res, next) {
    try {
      const { content } = req.body;
      const { postId } = req.params;

      const comment = await CommentService.createComment(
        req.user.id,
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
        req.user.id,
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

      const comment = await CommentService.likeComment(req.user.id, commentId);

      new SuccessResponse({
        message: "Comment like updated successfully",
        metadata: comment,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CommentController;
