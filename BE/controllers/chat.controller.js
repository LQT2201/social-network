const ChatService = require("../services/chat.service");
const { SuccessResponse } = require("../core/success.response");

class ChatController {
  static async getConversations(req, res, next) {
    try {
      const conversations = await ChatService.getConversations(req.user.id);
      new SuccessResponse({
        message: "Conversations retrieved successfully",
        metadata: conversations,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async pinConversation(req, res, next) {
    try {
      const { conversationId } = req.params;
      const conversation = await ChatService.pinConversation(
        conversationId,
        req.user.id
      );
      new SuccessResponse({
        message: "Conversation pinned successfully",
        metadata: conversation,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ChatController;
