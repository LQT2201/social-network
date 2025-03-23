const { SuccessResponse } = require("../core/success.response");
const PostService = require("../services/post.service");

class PostController {
  // Create new post
  static async createPost(req, res, next) {
    try {
      const files = req.files || [];
      const post = await PostService.createPost(req.user.id, req.body, files);

      new SuccessResponse({
        message: "Post created successfully",
        metadata: post,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  // Get all posts with pagination
  static async getPosts(req, res, next) {
    try {
      const result = await PostService.getPosts(req.query);

      new SuccessResponse({
        message: "Posts retrieved successfully",
        metadata: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  // Get single post by ID
  static async getPostById(req, res, next) {
    try {
      const post = await PostService.getPostById(req.params.id);

      new SuccessResponse({
        message: "Post retrieved successfully",
        metadata: post,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  // Like/Unlike post
  static async likePost(req, res, next) {
    try {
      const post = await PostService.likePost(req.params.id, req.user.id);

      new SuccessResponse({
        message: "Post like status updated",
        metadata: post,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  // Share post
  static async sharePost(req, res, next) {
    try {
      const post = await PostService.sharePost(req.params.id, req.user.id);

      new SuccessResponse({
        message: "Post shared successfully",
        metadata: post,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  // Vote in poll
  static async voteInPoll(req, res, next) {
    try {
      const post = await PostService.voteInPoll(
        req.params.id,
        req.user.id,
        req.body.optionId
      );

      new SuccessResponse({
        message: "Vote recorded successfully",
        metadata: post,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  // Delete post
  static async deletePost(req, res, next) {
    try {
      await PostService.deletePost(req.params.id, req.user.id);

      new SuccessResponse({
        message: "Post deleted successfully",
        metadata: null,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  // Update post
  static async updatePost(req, res, next) {
    try {
      const files = req.files || [];
      const post = await PostService.updatePost(
        req.params.id,
        req.user.id,
        req.body,
        files
      );

      new SuccessResponse({
        message: "Post updated successfully",
        metadata: post,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PostController;
