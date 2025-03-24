const Post = require("../models/post.model");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { uploadFile, deleteFile } = require("../utils/upload");

class PostService {
  static async createPost(userId, postData, files) {
    let uploadedFiles = [];

    try {
      // Validate input
      if (!postData.content && (!files || files.length === 0)) {
        throw new BadRequestError("Post must contain content or media");
      }

      // Upload files first
      if (files && files.length > 0) {
        uploadedFiles = await Promise.all(
          files.map((file) => uploadFile(file))
        );
      }

      // Create post object
      const post = {
        author: userId,
        content: postData.content,
        metadata: {
          tags: postData.tags || [],
          location: postData.location,
        },
        settings: {
          visibility: postData.visibility || "public",
        },
        media: uploadedFiles,
        status: "active",
        stats: {
          likes: [],
          comments: [],
          shares: [],
        },
      };

      // Save to database
      const newPost = await Post.create(post);
      return await newPost.populate("author", "username avatar");
    } catch (error) {
      // Clean up uploaded files if post creation fails
      if (uploadedFiles.length > 0) {
        await Promise.all(
          uploadedFiles.map((file) => deleteFile(file.publicId))
        );
      }
      throw new BadRequestError(error.message || "Could not create post");
    }
  }

  static async updatePost(postId, userId, updateData, newFiles = []) {
    let uploadedFiles = [];
    try {
      // Find existing post
      const post = await Post.findOne({ _id: postId, author: userId });
      if (!post) {
        throw new NotFoundError("Post not found");
      }

      // Handle new file uploads
      if (newFiles.length > 0) {
        uploadedFiles = await Promise.all(
          newFiles.map((file) => uploadFile(file))
        );
      }

      // Delete removed files
      if (updateData.removedMedia) {
        const removedMedia = JSON.parse(updateData.removedMedia);
        await Promise.all(
          removedMedia.map((mediaId) => {
            const media = post.media.find((m) => m.publicId === mediaId);
            if (media) return deleteFile(media.publicId);
          })
        );
      }

      // Update post
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
          content: updateData.content,
          "metadata.tags": updateData.tags
            ? JSON.parse(updateData.tags)
            : post.metadata.tags,
          "metadata.location": updateData.location
            ? JSON.parse(updateData.location)
            : post.metadata.location,
          "settings.visibility":
            updateData.visibility || post.settings.visibility,
          $push: { media: { $each: uploadedFiles } },
        },
        { new: true }
      ).populate("author", "username avatar");

      return updatedPost;
    } catch (error) {
      // Clean up new uploads if update fails
      if (uploadedFiles.length > 0) {
        await Promise.all(
          uploadedFiles.map((file) => deleteFile(file.publicId))
        );
      }
      throw new BadRequestError(error.message || "Could not update post");
    }
  }

  static async getPosts(query) {
    const { page = 1, limit = 10, visibility = "public", tag } = query;

    try {
      let filter = {
        "settings.visibility": visibility,
        status: "active",
      };

      // Add tag filter if provided
      if (tag) {
        filter["metadata.tags"] = tag;
      }

      const posts = await Post.find(filter)
        .populate("author", "username avatar")
        .populate({
          path: "stats.comments",
          select: "content author createdAt",
          populate: { path: "author", select: "username avatar" },
        })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Post.countDocuments(filter);

      return {
        posts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new BadRequestError("Could not fetch posts");
    }
  }

  static async getPostById(postId) {
    try {
      console.log(postId);
      const post = await Post.findById(postId)
        .populate("author", "username avatar")
        .populate({
          path: "stats.comments",
          select: "content author parentComment createdAt",
          populate: { path: "author", select: "username avatar" },
        })
        .populate("stats.likes", "username avatar")
        .populate("stats.shares", "username avatar");

      if (!post) {
        throw new NotFoundError("Post not found");
      }

      console.log(post);

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

      const userLikeIndex = post.stats.likes.indexOf(userId);

      if (userLikeIndex > -1) {
        // Unlike
        post.stats.likes.splice(userLikeIndex, 1);
      } else {
        // Like
        post.stats.likes.push(userId);
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

      if (!post.isVisible(userId)) {
        throw new BadRequestError(
          "You don't have permission to share this post"
        );
      }

      post.stats.shares.push(userId);

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

  static async deletePost(postId, userId) {
    try {
      const post = await Post.findOne({ _id: postId, author: userId });
      if (!post) {
        throw new NotFoundError("Post not found");
      }

      // Delete associated media files
      if (post.media && post.media.length > 0) {
        await Promise.all(
          post.media.map((media) => deleteFile(media.publicId))
        );
      }

      await Post.deleteOne({ _id: postId });
      return true;
    } catch (error) {
      throw new BadRequestError("Could not delete post");
    }
  }
}

module.exports = PostService;
