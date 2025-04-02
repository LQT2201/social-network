import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { MessageService } from "@/services/message.service";
import { toast } from "react-hot-toast";

// Async thunks
export const fetchConversations = createAsyncThunk(
  "messages/fetchConversations",
  async ({ page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await MessageService.getConversations(page, limit);

      return response;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async ({ conversationId, page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await MessageService.getMessages(
        conversationId,
        page,
        limit
      );
      return {
        conversationId,
        ...response,
      };
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async (
    { conversationId, content, media = null, replyTo = null },
    { rejectWithValue }
  ) => {
    try {
      const response = await MessageService.createMessage({
        conversationId,
        content,
        media,
        replyTo,
      });
      const message = response.message;

      return message;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const createConversation = createAsyncThunk(
  "messages/createConversation",
  async ({ participantId }, { rejectWithValue }) => {
    try {
      const response = await MessageService.createConversation(participantId);
      return response;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const markConversationAsRead = createAsyncThunk(
  "messages/markConversationAsRead",
  async ({ conversationId, userId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await MessageService.markAsRead(conversationId);

      // Use userId passed from component instead of accessing localStorage
      if (userId) {
        dispatch(markMessagesAsRead({ conversationId, userId }));
      }

      return response;
    } catch (error) {
      toast.error("Không thể đánh dấu tin nhắn đã đọc");
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  conversations: [],
  activeConversation: {},
  messagesByConversation: {},
  onlineUsers: [],
  status: "idle",
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    hasMore: true,
  },
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },

    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

    addMessage: (state, action) => {
      const {
        conversationId,
        message,
        isLocalMessage = false,
      } = action.payload;

      // Khởi tạo mảng tin nhắn nếu chưa tồn tại
      if (!state.messagesByConversation[conversationId]) {
        state.messagesByConversation[conversationId] = [];
      }

      // Tạo ID tin nhắn tạm thời nếu chưa có
      const messageId =
        message._id ||
        `temp-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

      // Chuẩn hóa dữ liệu người gửi
      const normalizedSender =
        typeof message.sender === "string"
          ? { _id: message.sender, username: "User" }
          : message.sender;

      // Tạo đối tượng tin nhắn mới
      const newMessage = {
        _id: messageId,
        sender: normalizedSender,
        content: message.content,
        createdAt: message.createdAt
          ? new Date(message.createdAt).toISOString()
          : new Date().toISOString(),
        updatedAt: message.updatedAt || new Date().toISOString(),
        isEdited: message.isEdited || false,
        media: message.media || [],
        reactions: message.reactions || [],
        readBy: message.readBy || [],
        replyTo: message.replyTo || null,
        status: isLocalMessage ? "sending" : "sent",
        isLocalMessage,
      };

      // Thêm tin nhắn vào mảng
      state.messagesByConversation[conversationId].push(newMessage);

      // Cập nhật cuộc trò chuyện
      const conversation = state.conversations.find(
        (c) => c._id === conversationId
      );
      if (!conversation) return;

      // Cập nhật tin nhắn cuối cùng
      conversation.lastMessage = newMessage;

      // Cập nhật unreadCount
      const userUnread = conversation.unreadCount.find(
        (item) => item.user !== message.sender
      );
      console.log(conversation);

      if (userUnread) {
        userUnread.count = userUnread.count + 1;
      }
    },

    markMessagesAsRead: (state, action) => {
      const { conversationId, userId } = action.payload;
      if (!conversationId || !userId) return;

      const messages = state.messagesByConversation[conversationId];
      if (!messages?.length) return;

      // Đánh dấu tin nhắn đã đọc
      messages.forEach((message) => {
        if (!message.readBy.some((read) => read.user === userId)) {
          message.readBy.push({
            user: userId,
            readAt: new Date().toISOString(),
          });
        }
      });

      // Cập nhật unreadCount
      const conversation = state.conversations.find(
        (c) => c._id === conversationId
      );
      if (!conversation) return;

      // Đảm bảo unreadCount là mảng
      if (!Array.isArray(conversation.unreadCount)) {
        conversation.unreadCount = [];
        return;
      }

      // Tìm và reset unreadCount cho người dùng hiện tại
      const userUnreadIndex = conversation.unreadCount.findIndex(
        (item) => item.user === userId
      );

      if (userUnreadIndex !== -1) {
        conversation.unreadCount[userUnreadIndex].count = 0;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchConversations
      .addCase(fetchConversations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.conversations = action.payload.conversations;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Handle fetchMessages with error states
      .addCase(fetchMessages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { conversationId, messages, pagination } = action.payload;
        state.messagesByConversation[conversationId] = messages;
        state.pagination = pagination;
        state.status = "succeeded";
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Handle sendMessage with error states
      .addCase(sendMessage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const message = action.payload;
        const conversationId = message.conversation._id;

        if (!state.messagesByConversation[conversationId]) {
          state.messagesByConversation[conversationId] = [];
        }
        state.messagesByConversation[conversationId].push(message);

        // Update last message
        const conversation = state.conversations.find(
          (c) => c._id === conversationId
        );
        if (conversation) {
          conversation.lastMessage = message;
        }
        state.status = "succeeded";
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Handle createConversation with error states
      .addCase(createConversation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        // state.conversations.unshift(action.payload);
        state.activeConversation = action.payload;
        state.status = "succeeded";
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Handle markConversationAsRead with error states
      .addCase(markConversationAsRead.pending, (state) => {
        state.status = "loading";
      })
      .addCase(markConversationAsRead.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(markConversationAsRead.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectAllConversations = (state) => state.messages.conversations;
export const selectOnlineUsers = (state) => state.messages.onlineUsers;
export const selectActiveConversation = (state) =>
  state.messages.activeConversation;
export const selectMessagesByConversation = (state, conversationId) =>
  state.messages.messagesByConversation[conversationId] || [];
export const selectConversationStatus = (state) => state.messages.status;
export const selectConversationError = (state) => state.messages.error;
export const selectPagination = (state) => state.messages.pagination;

export const {
  setActiveConversation,
  setOnlineUsers,
  addMessage,
  markMessagesAsRead,
} = messageSlice.actions;

export { markMessagesAsRead as markAsRead };

export default messageSlice.reducer;
