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
      conservation: conversationId,
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
    const conversation = Conversation.findOne({
      _id: conversationId,
      participants: { $in: [userId] },
    });
    if (!conversation)
      throw new NotFoundError("Not found conversation or user not authorized");

    const messages = await Message.find({ conversaton: conversationId })
      .sort({
        createAt: -1,
      })
      .skip((page - 1) * limit)
      .populate({ path: "sender", select: "username avatar" })
      .populate({ path: "replyTo", select: "content sender" })
      .lean();

    return {
      messages: messages.reverse(),
      pagination: {
        page,
        limit,
        hasMore: messages.length === limit,
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
  //
}

module.exports = MessageService;
