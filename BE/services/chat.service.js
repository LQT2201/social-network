const Conversation = require("../models/conversation.model");
const { BadRequestError, NotFoundError } = require("../core/error.response");

class ChatService {
  static async getConversations(userId, query = {}) {
    const { page = 1, limit = 20 } = query;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "username avatar")
      .populate("lastMessage")
      .sort({
        // Sort pinned conversations first, then by updatedAt
        [`isPinned.${userId}`]: -1,
        updatedAt: -1,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Conversation.countDocuments({
      participants: userId,
    });

    return {
      conversations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
      },
    };
  }

  static async createConversation(userId, participantId) {
    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      type: "private",
      participants: {
        $all: [userId, participantId],
      },
    });

    if (existingConversation) {
      return existingConversation;
    }

    // Create new conversation
    const conversation = await Conversation.create({
      participants: [userId, participantId],
      type: "private",
    });

    return conversation.populate("participants", "username avatar");
  }

  static async pinConversation(conversationId, userId) {
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    });

    if (!conversation) {
      throw new NotFoundError("Conversation not found");
    }

    // Toggle pin status
    const currentPinStatus = conversation.isPinned.get(userId) || false;
    conversation.isPinned.set(userId, !currentPinStatus);

    await conversation.save();
    return conversation;
  }

  static async addMessage(conversationId, userId, messageData) {
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    });

    if (!conversation) {
      throw new NotFoundError("Conversation not found");
    }

    const newMessage = {
      sender: userId,
      content: messageData.content,
      media: messageData.media || [],
      readBy: [{ user: userId }],
    };

    conversation.messages.push(newMessage);
    conversation.lastMessage = newMessage;

    await conversation.save();
    return newMessage;
  }

  static async markAsRead(conversationId, userId) {
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    });

    if (!conversation) {
      throw new NotFoundError("Conversation not found");
    }

    // Mark all unread messages as read
    conversation.messages.forEach((message) => {
      if (!message.readBy.some((read) => read.user.toString() === userId)) {
        message.readBy.push({ user: userId });
      }
    });

    await conversation.save();
    return conversation;
  }

  static async deleteConversation(conversationId, userId) {
    const conversation = await Conversation.findOneAndDelete({
      _id: conversationId,
      participants: userId,
    });

    if (!conversation) {
      throw new NotFoundError("Conversation not found");
    }

    return { message: "Conversation deleted successfully" };
  }
}

module.exports = ChatService;
