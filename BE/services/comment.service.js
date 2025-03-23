const Comment = require("../models/comment.model");
const Post = require("../models/post.model");
const { BadRequestError, NotFoundError } = require("../core/error.response");

class CommentService {
  static async createComment(userId, postId, content) {
    const post = await Post.findById(postId);
    if (!post) {
      throw new NotFoundError("Post not found");
    }

    const comment = await Comment.create({
      content,
      author: userId,
      post: postId,
    });

    await Post.findByIdAndUpdate(postId, {
      $push: { comments: comment._id },
    });

    return comment;
  }

  static async createReply(userId, commentId, content) {
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      throw new NotFoundError("Parent comment not found");
    }

    const reply = await Comment.create({
      content,
      author: userId,
      post: parentComment.post,
      parentComment: commentId,
    });

    await Comment.findByIdAndUpdate(commentId, {
      $push: { replies: reply._id },
    });

    return reply;
  }

  static async likeComment(userId, commentId) {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new NotFoundError("Comment not found");
    }

    const alreadyLiked = comment.likes.find(
      (like) => like.user.toString() === userId
    );

    if (alreadyLiked) {
      comment.likes = comment.likes.filter(
        (like) => like.user.toString() !== userId
      );
    } else {
      comment.likes.push({ user: userId });
    }

    await comment.save();
    return comment;
  }
}

module.exports = CommentService;
