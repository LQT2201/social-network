const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/notification.controller");
const authentication = require("../middlewares/auth.middleware");

router.use(authentication);

router.get("/notifications", NotificationController.getNotifications);
router.post("/notifications/:id/read", NotificationController.markAsRead);

module.exports = router;
