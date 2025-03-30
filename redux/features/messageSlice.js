import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { MessageService } from "@/services/message.service";

// Async thunks
export const fetchConversations = createAsyncThunk(
  "messages/fetchConversations",
  async ({ page = 1, limit = 20 }) => {
    const response = await MessageService.getConversations(page, limit);
    return response.metadata;
  }
);

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async ({ conversationId, page = 1, limit = 20 }) => {
    const response = await MessageService.getMessages(
      conversationId,
      page,
      limit
    );
    return {
      conversationId,
      ...response.metadata,
    };
  }
);

export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ conversationId, content, media, replyTo }) => {
    const response = await MessageService.createMessage({
      conversationId,
      content,
      media,
      replyTo,
    });
    return response.metadata;
  }
);

export const createConversation = createAsyncThunk(
  "messages/createConversation",
  async ({ participantId }, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/messages/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": localStorage.getItem("x-client-id"),
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ participantId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create conversation");
      }

      const data = await response.json();
      return data.metadata;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  conversations: [],
  activeConversation: null,
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
      const { conversationId, message } = action.payload;
      if (!state.messagesByConversation[conversationId]) {
        state.messagesByConversation[conversationId] = [];
      }
      state.messagesByConversation[conversationId].push(message);

      // Update last message in conversations list
      const conversation = state.conversations.find(
        (c) => c._id === conversationId
      );
      if (conversation) {
        conversation.lastMessage = message;
      }
    },
    markMessagesAsRead: (state, action) => {
      const { conversationId, userId } = action.payload;
      const messages = state.messagesByConversation[conversationId];
      if (messages) {
        messages.forEach((message) => {
          if (!message.readBy.some((read) => read.user === userId)) {
            message.readBy.push({
              user: userId,
              readAt: new Date().toISOString(),
            });
          }
        });
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
        state.error = action.error.message;
      })
      // Handle fetchMessages
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { conversationId, messages, pagination } = action.payload;
        state.messagesByConversation[conversationId] = messages;
        state.pagination = pagination;
      })
      // Handle sendMessage
      .addCase(sendMessage.fulfilled, (state, action) => {
        const message = action.payload;
        const conversationId = message.conversation;

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
      })
      // Handle createConversation
      .addCase(createConversation.fulfilled, (state, action) => {
        state.conversations.unshift(action.payload);
        state.activeConversation = action.payload;
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

export default messageSlice.reducer;
