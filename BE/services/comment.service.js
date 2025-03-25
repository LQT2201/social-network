const Comment = require("../models/comment.model");
const Post = require("../models/post.model");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const mongoose = require("mongoose");

class CommentService {
  static async createComment(userId, postId, content) {
    try {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Find post and validate
        const post = await Post.findById(postId).session(session);
        if (!post) {
          throw new NotFoundError("Post not found");
        }

        // Create comment
        const comment = await Comment.create(
          [
            {
              content,
              author: userId,
              post: postId,
              likes: [],
              replies: [],
            },
          ],
          { session }
        );

        // Update post's stats
        await Post.findByIdAndUpdate(
          postId,
          {
            $push: { "stats.comments": comment[0]._id },
          },
          { session }
        );

        await session.commitTransaction();

        // Return populated comment
        return await Comment.findById(comment[0]._id)
          .populate("author", "username avatar")
          .populate({
            path: "replies",
            populate: {
              path: "author",
              select: "username avatar",
            },
          });
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    } catch (error) {
      console.error("Create Comment Error:", error);
      throw error;
    }
  }

  static async createReply(userId, commentId, content) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find and validate parent comment
      const parentComment = await Comment.findById(commentId).session(session);
      if (!parentComment) {
        throw new NotFoundError("Parent comment not found");
      }

      // Create reply
      const reply = await Comment.create(
        [
          {
            content,
            author: userId,
            post: parentComment.post,
            parentComment: commentId,
            likes: [],
          },
        ],
        { session }
      );

      // Update parent comment
      await Comment.findByIdAndUpdate(
        commentId,
        {
          $push: { replies: reply[0]._id },
        },
        { session }
      );

      // Update post's stats
      await Post.findByIdAndUpdate(
        parentComment.post,
        {
          $push: { "stats.comments": reply[0]._id },
        },
        { session }
      );

      await session.commitTransaction();

      // Return populated reply
      return await Comment.findById(reply[0]._id)
        .populate("author", "username avatar")
        .populate("parentComment", "content")
        .populate({
          path: "post",
          select: "content author",
        });
    } catch (error) {
      await session.abortTransaction();
      console.error("Create Reply Error:", error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async likeComment(userId, commentId) {
    try {
      // Validate IDs
      if (
        !mongoose.Types.ObjectId.isValid(commentId) ||
        !mongoose.Types.ObjectId.isValid(userId)
      ) {
        throw new BadRequestError("Invalid comment or user ID");
      }

      const comment = await Comment.findById(commentId);
      if (!comment) {
        throw new NotFoundError("Comment not found");
      }

      const likeIndex = comment.likes.indexOf(userId);

      if (likeIndex > -1) {
        // Unlike - remove userId from likes array
        comment.likes.pull(userId);
      } else {
        // Like - add userId to likes array
        comment.likes.push(userId);
      }

      await comment.save();

      // Return populated comment
      return await comment.populate([
        { path: "author", select: "username avatar" },
        { path: "likes", select: "username avatar" },
      ]);
    } catch (error) {
      console.error("Like Comment Error:", error);
      throw error;
    }
  }

  static async getCommentsByPost(postId, query = {}) {
    try {
      const { page = 1, limit = 10 } = query;

      const comments = await Comment.find({
        post: postId,
        parentComment: null, // Get only top-level comments
      })
        .populate("author", "username avatar")
        .populate({
          path: "replies",
          populate: {
            path: "author",
            select: "username avatar",
          },
        })
        .populate("likes", "username avatar")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Comment.countDocuments({
        post: postId,
        parentComment: null,
      });

      return {
        comments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Get Comments Error:", error);
      throw error;
    }
  }

  static async getPostComments(postId, page = 1, limit = 10) {
    // Get root comments first
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      Comment.find({ post: postId, parentId: null })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "username avatar")
        .lean(),
      Comment.countDocuments({ post: postId, parentId: null }),
    ]);

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parentId: comment._id })
          .sort({ createdAt: 1 })
          .populate("author", "username avatar")
          .lean();

        return {
          ...comment,
          replies,
        };
      })
    );

    return {
      comments: commentsWithReplies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

module.exports = CommentService;
