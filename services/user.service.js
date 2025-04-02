import axios from "@/lib/axios";

export const UserService = {
  async getCurrentUser() {
    try {
      const response = await axios.get("/users/current");
      return response.data.metadata;
    } catch (error) {
      throw new Error(`Failed to get current user: ${error.message}`);
    }
  },

  async searchUsers(query, page = 1, limit = 10) {
    try {
      const response = await axios.get("/users/search", {
        params: {
          query: query.trim(),
          page,
          limit,
        },
      });
      return response.data.metadata;
    } catch (error) {
      throw new Error(`Failed to search users: ${error.message}`);
    }
  },

  async getAllUsers(page = 1, limit = 20) {
    try {
      const response = await axios.get("/users/all", {
        params: {
          page,
          limit,
        },
      });
      return response.data.metadata;
    } catch (error) {
      throw new Error(`Failed to get all users: ${error.message}`);
    }
  },

  async getFollowingUsers(page = 1, limit = 20) {
    try {
      const response = await axios.get("/users/following", {
        params: {
          page,
          limit,
        },
      });
      return response.data.metadata;
    } catch (error) {
      throw new Error(`Failed to get following users: ${error.message}`);
    }
  },

  async checkFollowStatus(targetUserId) {
    try {
      const response = await axios.get(`/users/follow-status/${targetUserId}`);
      return response.data.metadata.isFollowing;
    } catch (error) {
      throw new Error(`Failed to check follow status: ${error.message}`);
    }
  },

  async getUserById(userId) {
    try {
      if (!userId) throw new Error("User ID is required");
      const response = await axios.get(`/users/${userId}`);
      return response.data.metadata;
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  },

  async updateProfile(userData) {
    try {
      const formData = new FormData();

      // Validate input data
      if (!userData) throw new Error("User data is required");

      // Handle avatar file
      if (userData.avatar instanceof File) {
        formData.append("avatar", userData.avatar);
      }

      // Add other user data
      Object.entries(userData).forEach(([key, value]) => {
        if (key !== "avatar" && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      const response = await axios.patch("/users/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.metadata;
    } catch (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  },

  async followUser(targetUserId) {
    try {
      if (!targetUserId) throw new Error("Target user ID is required");
      const response = await axios.post(`/users/${targetUserId}/follow`);
      return response.data.metadata;
    } catch (error) {
      throw new Error(`Failed to follow user: ${error.message}`);
    }
  },

  async unfollowUser(targetUserId) {
    try {
      if (!targetUserId) throw new Error("Target user ID is required");
      const response = await axios.delete(`/users/${targetUserId}/follow`);
      return response.data.metadata;
    } catch (error) {
      throw new Error(`Failed to unfollow user: ${error.message}`);
    }
  },
};
