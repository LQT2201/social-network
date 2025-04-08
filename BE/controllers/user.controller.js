const { SuccessResponse } = require("../core/success.response");
const UserService = require("../services/user.service");

class UserController {
  static async getRecommendUsers(req, res, next) {
    try {
      const result = await UserService.getRecommendUsers(req.userId);
      new SuccessResponse({
        message: "Recommend users retrieved successfully",
        metadata: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async getCurrentUser(req, res, next) {
    try {
      const user = await UserService.getUserById(req.userId);
      new SuccessResponse({
        message: "User retrieved successfully",
        metadata: user,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async searchUsers(req, res, next) {
    try {
      const { query = "", page = 1, limit = 10 } = req.query;
      const result = await UserService.searchUsers(
        query,
        req.userId,
        parseInt(page),
        parseInt(limit)
      );
      new SuccessResponse({
        message: "Users searched successfully",
        metadata: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async getAllUsers(req, res, next) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const result = await UserService.getAllUsers(
        req.userId,
        parseInt(page),
        parseInt(limit)
      );
      new SuccessResponse({
        message: "Users retrieved successfully",
        metadata: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async getFollowingUsers(req, res, next) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const result = await UserService.getFollowingUsers(
        req.userId,
        parseInt(page),
        parseInt(limit)
      );
      new SuccessResponse({
        message: "Following users retrieved successfully",
        metadata: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async checkFollowStatus(req, res, next) {
    try {
      const { targetUserId } = req.params;
      const isFollowing = await UserService.checkIfFollowing(
        req.userId,
        targetUserId
      );
      new SuccessResponse({
        message: "Follow status checked successfully",
        metadata: { isFollowing },
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req, res, next) {
    try {
      const { userId } = req.params;
      const user = await UserService.getUserById(userId);
      new SuccessResponse({
        message: "User retrieved successfully",
        metadata: user,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const { userId } = req.params;
      const data = req.body;
      const files = req.files;

      // Handle file uploads
      if (files) {
        if (files.avatar) {
          data.avatar = files.avatar[0].path;
        }
        if (files.coverImage) {
          data.coverImage = files.coverImage[0].path;
        }
      }

      const updatedUser = await UserService.updateProfile(userId, data);
      new SuccessResponse({
        message: "Profile updated successfully",
        metadata: updatedUser,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async followUser(req, res, next) {
    try {
      const { userId } = req.params;
      const currentUserId = req.userId;

      const result = await UserService.followUser(currentUserId, userId);
      new SuccessResponse({
        message: "Followed successfully",
        metadata: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async unfollowUser(req, res, next) {
    try {
      const { userId } = req.params;
      const currentUserId = req.userId;

      const result = await UserService.unfollowUser(currentUserId, userId);
      new SuccessResponse({
        message: "Unfollowed successfully",
        metadata: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async getFollowers(req, res, next) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const result = await UserService.getFollowers(
        userId,
        parseInt(page),
        parseInt(limit)
      );
      new SuccessResponse({
        message: "Followers retrieved successfully",
        metadata: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async getFollowing(req, res, next) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const result = await UserService.getFollowing(
        userId,
        parseInt(page),
        parseInt(limit)
      );
      new SuccessResponse({
        message: "Following users retrieved successfully",
        metadata: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async updateUserStatus(req, res, next) {
    try {
      const { userId } = req.params;
      const { status } = req.body;

      const updatedUser = await UserService.updateUserStatus(userId, status);
      new SuccessResponse({
        message: "User status updated successfully",
        metadata: updatedUser,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
