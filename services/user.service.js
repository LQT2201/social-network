import axios from "@/lib/axios";

export const UserService = {
  async getCurrentUser() {
    try {
      const response = await axios.get("/users/current");
      return response.data.metadata;
    } catch (error) {
      throw new Error("Error fetching user: " + error.message);
    }
  },
};
