const Notification = require("../models/notification.model");
const { BadRequestError, NotFoundError } = require("../core/error.response");

class NotificationService {
  static async getNotifications(userId, query = {}) {
    const { page = 1, limit = 20 } = query;

    const notifications = await Notification.find({ recipient: userId })
      .populate("sender", "username avatar")
      .populate("post", "content")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Notification.countDocuments({ recipient: userId });

    return {
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
      },
    };
  }

  static async markAsRead(notificationId, userId) {
    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: userId,
    });

    if (!notification) {
      throw new NotFoundError("Notification not found");
    }

    notification.read = true;
    await notification.save();

    return notification;
  }
}

module.exports = NotificationService;
