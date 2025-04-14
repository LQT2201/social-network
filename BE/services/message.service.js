const { NotFoundError } = require("../core/error.response");
const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");

class MessageService {
  static async createMessage({
    senderId,
    conversationId,
    content,
    media,
    replyTo,
  }) {
    const conservation = await Conversation.findOne({
      _id: conversationId,
      participants: { $in: [senderId] },
    });
    if (!conservation)
      throw new NotFoundError(
        "Not found conversation or user not in conservation"
      );

    // Create new message
    const message = await Message.create({
      conversation: conversationId,
      sender: senderId,
      content,
      media: media || [],
      replyTo,
    });

    await Conversation.findByIdAndUpdate(
      conversationId,
      {
        lastMessage: message._id,
        $inc: {
          "unreadCount.$[elem].count": 1,
        },
      },
      {
        arrayFilters: [
          {
            "elem.user": {
              $ne: senderId,
            },
          },
        ],
      }
    );

    return message.populate([
      { path: "sender", select: "username avatar" },
      { path: "replyTo", select: "content sender" },
    ]);
  }

  static async getMessages(userId, conversationId, page = 1, limit = 20) {
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: { $in: [userId] },
    });
    if (!conversation)
      throw new NotFoundError("Not found conversation or user not authorized");

    const totalMessages = await Message.countDocuments({
      conversation: conversationId,
    });

    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({ path: "sender", select: "username avatar" })
      .populate({ path: "replyTo", select: "content sender" })
      .lean();

    return {
      messages: messages.reverse(),
      pagination: {
        page,
        limit,
        total: totalMessages,
        totalPages: Math.ceil(totalMessages / limit),
        hasMore: page * limit < totalMessages,
      },
    };
  }

  static async markAsRead(userId, conversationId) {
    await Conversation.updateOne(
      { _id: conversationId },
      {
        $set: {
          "unreadCount.$[elem].count": 0,
        },
      },
      {
        arrayFilters: [{ "elem.user": userId }],
      }
    );

    await Message.updateMany(
      {
        conversation: conversationId,
        "readBy.user": { $ne: userId },
      },
      {
        $push: {
          readBy: {
            user: userId,
            readAt: new Date(),
          },
        },
      }
    );

    return true;
  }

  static async addReaction(userId, messageId, reactionType) {
    const message = await Message.findById(messageId);
    if (!message) throw new NotFoundError("Message not found");
    ` 
    // Remove existing reaction`;
    await Message.updateOne(
      { _id: messageId },
      {
        $pull: { reactions: { user: userId } },
      }
    );

    const updateReaction = await Message.updateOne(
      { _id: messageId },
      {
        $push: {
          reactions: {
            user: userId,
            type: reactionType,
          },
        },
      }
    );

    return updateReaction;
  }

  static async getConversations(userId, page = 1, limit = 20) {
    try {
      const conversations = await Conversation.find({
        participants: { $in: [userId] },
      })
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({
          path: "participants",
          select: "username avatar isOnline",
          match: { _id: { $ne: userId } },
        })
        .populate({
          path: "lastMessage",
          select: "content sender createdAt media readBy",
          populate: {
            path: "sender",
            select: "username avatar",
          },
        })
        .lean();

      // Add isPinned flag to each conversation
      const conversationsWithPinStatus = conversations.map((conversation) => ({
        ...conversation,
        isPinned:
          conversation.pinnedBy && conversation.pinnedBy.includes(userId),
      }));

      // Get total count for pagination
      const total = await Conversation.countDocuments({
        participants: { $in: [userId] },
      });

      return {
        conversations: conversationsWithPinStatus,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: page * limit < total,
        },
      };
    } catch (error) {
      throw new Error(`Failed to get conversations: ${error.message}`);
    }
  }

  static async getConversationById(userId, conversationId) {
    try {
      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: { $in: [userId] },
      })
        .populate({
          path: "participants",
          select: "username avatar isOnline",
          match: { _id: { $ne: userId } },
        })
        .populate({
          path: "lastMessage",
          select: "content sender createdAt media readBy",
          populate: {
            path: "sender",
            select: "username avatar",
          },
        })
        .lean();

      if (!conversation) {
        throw new NotFoundError(
          "Conversation not found or user not authorized"
        );
      }

      // Format conversation response
      const otherParticipant = conversation.participants[0];
      const formattedConversation = {
        _id: conversation._id,
        participant: otherParticipant,
        lastMessage: conversation.lastMessage,
        unreadCount:
          conversation.unreadCount.find((uc) => uc.user.toString() === userId)
            ?.count || 0,
        updatedAt: conversation.updatedAt,
        createdAt: conversation.createdAt,
      };

      return formattedConversation;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to get conversation: ${error.message}`);
    }
  }

  static async createConversation(userId, participantId) {
    try {
      // Check if conversation already exists
      const existingConversation = await Conversation.findOne({
        participants: {
          $all: [userId, participantId],
          $size: 2,
        },
      })
        .populate({
          path: "participants",
          select: "username avatar isOnline",
          match: { _id: { $ne: userId } },
        })
        .lean();

      if (existingConversation) {
        return existingConversation;
      }

      // Create new conversation
      const conversation = await Conversation.create({
        participants: [userId, participantId],
        unreadCount: [
          { user: userId, count: 0 },
          { user: participantId, count: 0 },
        ],
      });

      // Get populated and lean version of the new conversation
      const populatedConversation = await Conversation.findById(
        conversation._id
      )
        .populate({
          path: "participants",
          select: "username avatar isOnline",
          match: { _id: { $ne: userId } },
        })
        .lean();

      return populatedConversation;
    } catch (error) {
      throw new Error(`Failed to create conversation: ${error.message}`);
    }
  }

  static async togglePinConversation(userId, conversationId) {
    try {
      // Find the conversation and check if user is a participant
      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: { $in: [userId] },
      });

      if (!conversation) {
        throw new NotFoundError(
          "Conversation not found or user not authorized"
        );
      }

      // Check if the conversation is already pinned by this user
      const isPinned = conversation.pinnedBy.includes(userId);

      if (isPinned) {
        // Unpin the conversation
        await Conversation.findByIdAndUpdate(conversationId, {
          $pull: { pinnedBy: userId },
        });
      } else {
        // Pin the conversation
        await Conversation.findByIdAndUpdate(conversationId, {
          $addToSet: { pinnedBy: userId },
        });
      }

      // Return the updated conversation
      const updatedConversation = await Conversation.findById(conversationId)
        .populate({
          path: "participants",
          select: "username avatar isOnline",
          match: { _id: { $ne: userId } },
        })
        .populate({
          path: "lastMessage",
          select: "content sender createdAt media readBy",
          populate: {
            path: "sender",
            select: "username avatar",
          },
        })
        .lean();

      return {
        ...updatedConversation,
        isPinned: updatedConversation.pinnedBy.includes(userId),
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to toggle pin status: ${error.message}`);
    }
  }

  // Return pinned conversations
  static async getPinnedConversations(userId, page = 1, limit = 20) {
    try {
      const conversations = await Conversation.find({
        participants: { $in: [userId] },
        pinnedBy: { $in: [userId] },
      })
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({
          path: "participants",
          select: "username avatar isOnline",
          match: { _id: { $ne: userId } },
        })
        .populate({
          path: "lastMessage",
          select: "content sender createdAt media readBy",
          populate: {
            path: "sender",
            select: "username avatar",
          },
        })
        .lean();

      // Get total count for pagination
      const total = await Conversation.countDocuments({
        participants: { $in: [userId] },
        pinnedBy: { $in: [userId] },
      });

      return {
        conversations,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: page * limit < total,
        },
      };
    } catch (error) {
      throw new Error(`Failed to get pinned conversations: ${error.message}`);
    }
  }
}

module.exports = MessageService;
