const { AuthFailureError } = require("../core/error.response");
const User = require("../models/user.model"); // Assuming you have a User model defined

class UserService {
  static async getUserById(userId) {
    try {
      console.log(userId);
      const user = await User.findById(userId).select("-password");
      if (!user) {
        throw new AuthFailureError("User not found");
      }
      return user;
    } catch (error) {
      throw new Error("Error fetching user: " + error.message);
    }
  }

  static async searchUsers(query, currentUserId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const users = await User.find({
        $and: [
          { _id: { $ne: currentUserId } }, // Exclude current user
          {
            $or: [
              { username: { $regex: query, $options: "i" } },
              { email: { $regex: query, $options: "i" } },
            ],
          },
        ],
      })
        .select("username email avatar createdAt")
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await User.countDocuments({
        $and: [
          { _id: { $ne: currentUserId } },
          {
            $or: [
              { username: { $regex: query, $options: "i" } },
              { email: { $regex: query, $options: "i" } },
            ],
          },
        ],
      });

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error("Error searching users: " + error.message);
    }
  }

  static async getAllUsers(currentUserId, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;

      const users = await User.find({ _id: { $ne: currentUserId } })
        .select("username email avatar bio createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await User.countDocuments({ _id: { $ne: currentUserId } });

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error("Error fetching users: " + error.message);
    }
  }

  static async getFollowingUsers(userId, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;

      const user = await User.findById(userId)
        .populate({
          path: "following",
          select: "username email avatar bio createdAt",
          options: {
            skip: skip,
            limit: limit,
            sort: { createdAt: -1 },
          },
        })
        .lean();

      if (!user) {
        throw new AuthFailureError("User not found");
      }

      const total = user.following.length;

      return {
        users: user.following,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error("Error fetching following users: " + error.message);
    }
  }

  static async checkIfFollowing(userId, targetUserId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new AuthFailureError("User not found");
      }

      return user.following.includes(targetUserId);
    } catch (error) {
      throw new Error("Error checking follow status: " + error.message);
    }
  }
}

module.exports = UserService;
