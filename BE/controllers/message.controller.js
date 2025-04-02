const MessageService = require("../services/message.service");
const { SuccessResponse } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");

class MessageController {
  static async createConversation(req, res, next) {
    try {
      const { participantId } = req.body;
      const userId = req.userId;
      const conversation = await MessageService.createConversation(
        userId,
        participantId
      );
      new SuccessResponse({
        message: "Conversation created successfully",
        metadata: conversation,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }
  static async sendMessage(req, res, next) {
    try {
      const { conversationId, participantId, content, media, replyTo } =
        req.body;
      const senderId = req.userId;

      let conversation;

      // If conversationId is provided, verify it exists
      if (conversationId) {
        conversation = await MessageService.getConversationById(
          senderId,
          conversationId
        );
      }
      // If participantId is provided, create or get existing conversation
      else if (participantId) {
        conversation = await MessageService.createConversation(
          senderId,
          participantId
        );
      } else {
        throw new Error("Either conversationId or participantId is required");
      }

      // Create the message
      const message = await MessageService.createMessage({
        senderId,
        conversationId: conversation._id.toString(),
        content,
        media,
        replyTo,
      });

      new SuccessResponse({
        message: "Message sent successfully",
        metadata: {
          conversation,
          message,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async getMessages(req, res, next) {
    try {
      const { conversationId } = req.params;
      const { page = 1, limit = 20 } = req.query;
      const userId = req.userId;

      const result = await MessageService.getMessages(
        userId,
        conversationId,
        parseInt(page),
        parseInt(limit)
      );

      new SuccessResponse({
        message: "Messages retrieved successfully",
        metadata: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req, res, next) {
    try {
      const { conversationId } = req.params;
      const userId = req.userId;

      await MessageService.markAsRead(userId, conversationId);

      // Emit socket event
      const socketService = req.app.get("socketService");
      socketService.emitToConversation(conversationId, "messagesRead", {
        userId,
        conversationId,
        timestamp: new Date(),
      });

      new SuccessResponse({
        message: "Messages marked as read",
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async addReaction(req, res, next) {
    try {
      const { messageId } = req.params;
      const { type } = req.body;
      const userId = req.userId;

      const result = await MessageService.addReaction(userId, messageId, type);

      // Get conversation ID from message
      const message = await MessageService.getMessage(messageId);

      // Emit socket event
      const socketService = req.app.get("socketService");
      socketService.emitToConversation(
        message.conversation,
        "messageReaction",
        {
          messageId,
          userId,
          reactionType: type,
        }
      );

      new SuccessResponse({
        message: "Reaction added successfully",
        metadata: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async deleteMessage(req, res, next) {
    try {
      const { messageId } = req.params;
      const userId = req.userId;

      const message = await MessageService.deleteMessage(userId, messageId);

      // Emit socket event
      const socketService = req.app.get("socketService");
      socketService.emitToConversation(message.conversation, "messageDeleted", {
        messageId,
        conversationId: message.conversation,
      });

      new SuccessResponse({
        message: "Message deleted successfully",
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async editMessage(req, res, next) {
    try {
      const { messageId } = req.params;
      const { content } = req.body;
      const userId = req.userId;

      const message = await MessageService.editMessage(
        userId,
        messageId,
        content
      );

      // Emit socket event
      const socketService = req.app.get("socketService");
      socketService.emitToConversation(message.conversation, "messageEdited", {
        messageId,
        content,
        conversationId: message.conversation,
      });

      new SuccessResponse({
        message: "Message edited successfully",
        metadata: message,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async getConversations(req, res, next) {
    try {
      const userId = req.userId;
      const { page = 1, limit = 20 } = req.query;

      const result = await MessageService.getConversations(
        userId,
        parseInt(page),
        parseInt(limit)
      );

      new SuccessResponse({
        message: "Conversations retrieved successfully",
        metadata: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MessageController;
