const Post = require("../models/post.model");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { uploadFile } = require("../utils/upload"); // Assume we have this utility

class PostService {
  static async createPost(userId, postData, files) {
    try {
      const post = {
        author: userId,
        content: postData.content,
        metadata: {
          tags: postData.tags,
          location: postData.location,
        },
        settings: {
          visibility: postData.visibility || "public",
        },
      };

      // Handle media uploads if any
      if (files && files.length > 0) {
        post.media = await Promise.all(
          files.map(async (file) => {
            const uploadedFile = await uploadFile(file);
            return {
              type: file.mimetype.startsWith("image/") ? "image" : "video",
              url: uploadedFile.url,
              thumbnail: uploadedFile.thumbnail,
              dimensions: uploadedFile.dimensions,
            };
          })
        );
      }

      return await Post.create(post);
    } catch (error) {
      throw new BadRequestError("Could not create post");
    }
  }

  static async getPosts(query) {
    const { page = 1, limit = 10, visibility = "public" } = query;

    try {
      const posts = await Post.find({
        "settings.visibility": visibility,
        status: "active",
      })
        .populate("author", "username avatar")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Post.countDocuments({
        "settings.visibility": visibility,
        status: "active",
      });

      return {
        posts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
        },
      };
    } catch (error) {
      throw new BadRequestError("Could not fetch posts");
    }
  }

  static async getPostById(postId) {
    try {
      const post = await Post.findById(postId)
        .populate("author", "username avatar")
        .populate("engagement.comments");

      if (!post) {
        throw new NotFoundError("Post not found");
      }

      return post;
    } catch (error) {
      throw new BadRequestError("Could not fetch post");
    }
  }

  static async likePost(postId, userId) {
    try {
      const post = await Post.findById(postId);
      if (!post) {
        throw new NotFoundError("Post not found");
      }

      // Check if user already liked
      const alreadyLiked = post.engagement.likes.find(
        (like) => like.user.toString() === userId
      );

      if (alreadyLiked) {
        // Unlike if already liked
        post.engagement.likes = post.engagement.likes.filter(
          (like) => like.user.toString() !== userId
        );
      } else {
        // Add new like
        post.engagement.likes.push({ user: userId });
      }

      await post.save();
      return post;
    } catch (error) {
      throw new BadRequestError("Could not like/unlike post");
    }
  }

  static async sharePost(postId, userId) {
    try {
      const post = await Post.findById(postId);
      if (!post) {
        throw new NotFoundError("Post not found");
      }

      if (!post.settings.allowSharing) {
        throw new BadRequestError("Sharing is not allowed for this post");
      }

      post.engagement.shares.push({ user: userId });
      await post.save();

      return post;
    } catch (error) {
      throw new BadRequestError("Could not share post");
    }
  }

  static async voteInPoll(postId, userId, optionId) {
    try {
      const post = await Post.findById(postId);
      if (!post || !post.poll) {
        throw new NotFoundError("Poll not found");
      }

      // Check if poll is still active
      if (post.poll.endDate && new Date() > post.poll.endDate) {
        throw new BadRequestError("Poll has ended");
      }

      // Remove previous vote if exists
      post.poll.options.forEach((option) => {
        option.votes = option.votes.filter(
          (vote) => vote.toString() !== userId
        );
      });

      // Add new vote
      const option = post.poll.options.find(
        (opt) => opt._id.toString() === optionId
      );
      if (!option) {
        throw new BadRequestError("Invalid option");
      }

      option.votes.push(userId);
      await post.save();

      return post;
    } catch (error) {
      throw new BadRequestError("Could not vote in poll");
    }
  }
}

module.exports = PostService;
