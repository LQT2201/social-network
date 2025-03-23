const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/notification.controller");
const { authMiddleware } = require("../middlewares/auth");

router.use(authMiddleware);

router.get("/notifications", NotificationController.getNotifications);
router.post("/notifications/:id/read", NotificationController.markAsRead);

module.exports = router;
