import {
  fetchConversations,
  fetchMessages,
  createConversation,
  markConversationAsRead,
  togglePinConversationAsync,
  fetchPinnedConversations,
} from "./thunks";
import { toast } from "react-hot-toast";

export const buildExtraReducers = (builder) => {
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

    // Handle fetchMessages
    .addCase(fetchMessages.pending, (state) => {
      state.status = "loading";
    })
    .addCase(fetchMessages.fulfilled, (state, action) => {
      const { conversationId, messages, pagination } = action.payload;

      // Nếu là trang đầu tiên, gán mới messages
      if (pagination.page === 1) {
        state.messagesByConversation[conversationId] = messages;
      } else {
        // Nếu là trang tiếp theo, nối thêm messages vào cuối
        const existingMessages =
          state.messagesByConversation[conversationId] || [];
        state.messagesByConversation[conversationId] = [
          ...messages,
          ...existingMessages,
        ];
      }

      state.pagination = pagination;
      state.status = "succeeded";
    })
    .addCase(fetchMessages.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    })

    // Handle createConversation
    .addCase(createConversation.pending, (state) => {
      state.status = "loading";
    })
    .addCase(createConversation.fulfilled, (state, action) => {
      state.activeConversation = action.payload;

      // Thêm cuộc trò chuyện mới vào đầu danh sách nếu chưa tồn tại
      if (
        !state.conversations.some((conv) => conv._id === action.payload._id)
      ) {
        state.conversations.unshift(action.payload);
      }

      state.status = "succeeded";
    })
    .addCase(createConversation.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    })

    // Handle markConversationAsRead
    .addCase(markConversationAsRead.pending, (state) => {
      state.status = "loading";
    })
    .addCase(markConversationAsRead.fulfilled, (state) => {
      state.status = "succeeded";
    })
    .addCase(markConversationAsRead.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    })

    // Handle togglePinConversation
    .addCase(togglePinConversationAsync.pending, (state) => {
      state.status = "loading";
    })
    .addCase(togglePinConversationAsync.fulfilled, (state, action) => {
      state.status = "succeeded";
    })
    .addCase(togglePinConversationAsync.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
      toast.error("Không thể cập nhật trạng thái ghim cuộc trò chuyện");
    })

    // Handle fetchPinnedConversations
    .addCase(fetchPinnedConversations.pending, (state) => {
      state.status = "loading";
    })
    .addCase(fetchPinnedConversations.fulfilled, (state, action) => {
      state.status = "succeeded";
    })
    .addCase(fetchPinnedConversations.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });
};
