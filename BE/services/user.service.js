const { AuthFailureError } = require("../core/error.response");
const User = require("../models/user.model"); // Assuming you have a User model defined

class UserService {
  static async getRecommendUsers(userId, page = 1, limit = 4) {
    try {
      const user = await User.findById(userId).select("-password");
      if (!user) {
        throw new AuthFailureError("User not found");
      }
      const following = user.following;

      const total = await User.countDocuments({ _id: { $nin: following } });

      const skip = (page - 1) * limit;
      const recommendUsers = await User.find({
        _id: { $nin: following },
      })
        .select("-password")
        .skip(skip)
        .limit(limit)
        .lean();

      const pagination = {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      };
      return { recommendUsers, pagination };
    } catch (error) {
      throw new Error("Error fetching recommend users: " + error.message);
    }
  }

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
          { _id: { $ne: currentUserId } },
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

  static async updateProfile(userId, data) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new AuthFailureError("User not found");
      }

      // Update user profile
      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
          user[key] = data[key];
        }
      });

      await user.save();

      return user;
    } catch (error) {
      throw new Error("Error updating profile: " + error.message);
    }
  }

  static async followUser(currentUserId, targetUserId) {
    try {
      const [currentUser, targetUser] = await Promise.all([
        User.findById(currentUserId),
        User.findById(targetUserId),
      ]);

      if (!currentUser || !targetUser) {
        throw new AuthFailureError("User not found");
      }

      // Check if already following
      if (currentUser.following.includes(targetUserId)) {
        throw new Error("Already following this user");
      }

      // Add to following list
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);

      await Promise.all([currentUser.save(), targetUser.save()]);

      return {
        followers: targetUser.followers,
        following: currentUser.following,
      };
    } catch (error) {
      throw new Error("Error following user: " + error.message);
    }
  }

  static async unfollowUser(currentUserId, targetUserId) {
    try {
      const [currentUser, targetUser] = await Promise.all([
        User.findById(currentUserId),
        User.findById(targetUserId),
      ]);

      if (!currentUser || !targetUser) {
        throw new AuthFailureError("User not found");
      }

      // Remove from following list
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUserId
      );
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUserId
      );

      await Promise.all([currentUser.save(), targetUser.save()]);

      return {
        followers: targetUser.followers,
        following: currentUser.following,
      };
    } catch (error) {
      throw new Error("Error unfollowing user: " + error.message);
    }
  }

  static async getFollowers(userId, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;

      const user = await User.findById(userId)
        .populate({
          path: "followers",
          select: "username avatar fullName bio",
          options: {
            skip,
            limit,
            sort: { createdAt: -1 },
          },
        })
        .lean();

      if (!user) {
        throw new AuthFailureError("User not found");
      }

      // Ensure followers array exists
      const followers = user.followers || [];
      const total = followers.length;

      return {
        followers,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      if (error instanceof AuthFailureError) {
        throw error;
      }
      throw new Error("Error fetching followers: " + error.message);
    }
  }

  static async getFollowing(userId, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;

      const user = await User.findById(userId)
        .populate({
          path: "following",
          select: "username avatar fullName bio",
          options: {
            skip,
            limit,
            sort: { createdAt: -1 },
          },
        })
        .lean();

      if (!user) {
        throw new AuthFailureError("User not found");
      }

      // Ensure following array exists
      const following = user.following || [];
      const total = following.length;

      return {
        following,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      if (error instanceof AuthFailureError) {
        throw error;
      }
      throw new Error("Error fetching following: " + error.message);
    }
  }

  static async updateUserStatus(userId, status) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new AuthFailureError("User not found");
      }

      user.status = status;
      await user.save();

      return user;
    } catch (error) {
      throw new Error("Error updating user status: " + error.message);
    }
  }
}

module.exports = UserService;
