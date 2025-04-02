const { SuccessResponse } = require("../core/success.response");
const UserService = require("../services/user.service");

class UserController {
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
}

module.exports = UserController;
