const express = require("express");
const router = express.Router();
const ChatController = require("../controllers/chat.controller");
const authentication = require("../middlewares/auth.middleware");

router.use(authentication);

router.get("/conversations", ChatController.getConversations);
router.post(
  "/conversations/:conversationId/pin",
  ChatController.pinConversation
);

module.exports = router;
