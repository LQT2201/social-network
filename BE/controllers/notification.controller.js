const { SuccessResponse } = require("../core/success.response");
const NotificationService = require("../services/notification.service");

class NotificationController {
  static async getNotifications(req, res, next) {
    try {
      const result = await NotificationService.getNotifications(
        req.user.id,
        req.query
      );

      new SuccessResponse({
        message: "Notifications retrieved successfully",
        metadata: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req, res, next) {
    try {
      const notification = await NotificationService.markAsRead(
        req.params.id,
        req.user.id
      );

      new SuccessResponse({
        message: "Notification marked as read",
        metadata: notification,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = NotificationController;
