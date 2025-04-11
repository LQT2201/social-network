import axios from "@/lib/axios";

export const UserService = {
  async getRecommendUsers(page = 1, limit = 4) {
    try {
      const response = await axios.get("/users/recommend", {
        params: { page, limit },
      });
      return response.data.metadata;
    } catch (error) {
      throw new Error(`Failed to get recommend users: ${error.message}`);
    }
  },

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

      console.log("response", response);
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

      // Handle cover image file
      if (userData.coverImage instanceof File) {
        formData.append("coverImage", userData.coverImage);
      }

      // Add other user data
      Object.entries(userData).forEach(([key, value]) => {
        if (key !== "avatar" && key !== "coverImage" && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      const response = await axios.put("/users/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.metadata;
    } catch (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  },

  async getFollowers(userId, page = 1, limit = 20) {
    try {
      if (!userId) throw new Error("User ID is required");
      const response = await axios.get(`/users/${userId}/followers`, {
        params: { page, limit },
      });
      return response.data.metadata;
    } catch (error) {
      throw new Error(`Failed to get followers: ${error.message}`);
    }
  },

  async getFollowing(userId, page = 1, limit = 20) {
    try {
      if (!userId) throw new Error("User ID is required");
      const response = await axios.get(`/users/${userId}/following`, {
        params: { page, limit },
      });
      return response.data.metadata;
    } catch (error) {
      throw new Error(`Failed to get following: ${error.message}`);
    }
  },

  async updateUserStatus(status) {
    try {
      if (!status) throw new Error("Status is required");
      const response = await axios.patch("/users/status", { status });
      return response.data.metadata;
    } catch (error) {
      throw new Error(`Failed to update status: ${error.message}`);
    }
  },
};
