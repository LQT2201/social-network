const express = require("express");
const router = express.Router();
const MessageController = require("../controllers/message.controller");
const authentication = require("../middlewares/auth.middleware");

// Apply authentication middleware to all routes
router.use(authentication);

// Conversation routes
router.get("/conversations", MessageController.getConversations);
router.get("/:conversationId/messages", MessageController.getMessages);

// Message actions
router.post("/send", MessageController.sendMessage);
router.patch("/:conversationId/read", MessageController.markAsRead);
router.post("/messages/:messageId/reactions", MessageController.addReaction);
router.delete("/messages/:messageId", MessageController.deleteMessage);
router.patch("/messages/:messageId", MessageController.editMessage);

module.exports = router;
