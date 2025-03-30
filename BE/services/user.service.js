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
}

module.exports = UserService;
