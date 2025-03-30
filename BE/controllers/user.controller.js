const { SuccessResponse } = require("../core/success.response");
const UserService = require("../services/user.service");

// Get current user
class UserController {
  static getCurrentUser = async (req, res, next) => {
    try {
      const clientId = req.userId;

      const user = await UserService.getUserById(clientId);
      new SuccessResponse({
        message: "User retrieved successfully",
        metadata: user,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}
// Update exports to include getCurrentUser
module.exports = UserController;
