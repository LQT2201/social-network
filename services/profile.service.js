import axios from "@/lib/axios";

class ProfileService {
  static async getProfile(userId) {
    const response = await axios.get(`/users/${userId}`);
    return response.data.metadata;
  }

  static async updateProfile(userId, data) {
    const response = await axios.put(`/users/${userId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.metadata;
  }

  static async followUser(userId) {
    console.log(userId, "hllo");
    const response = await axios.post(`/users/${userId}/follow`);
    console.log(response, "hllo");
    return response.data.metadata;
  }

  static async unfollowUser(userId) {
    const response = await axios.delete(`/users/${userId}/follow`);
    return response.data.metadata;
  }

  static async getFollowers(userId) {
    const response = await axios.get(`/users/${userId}/followers`);
    return response.data.metadata;
  }

  static async getFollowing(userId) {
    const response = await axios.get(`/users/${userId}/following`);
    return response.data.metadata;
  }

  static async getFollowingUsers(userId, page = 1, limit = 10) {
    const response = await axios.get(
      `/users/${userId}/following?page=${page}&limit=${limit}`
    );
    return response.data.metadata;
  }

  static async getFollowersUsers(userId, page = 1, limit = 10) {
    const response = await axios.get(
      `/users/${userId}/followers?page=${page}&limit=${limit}`
    );
    return response.data.metadata;
  }
}

export default ProfileService;
