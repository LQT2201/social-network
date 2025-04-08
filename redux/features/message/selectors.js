export const selectAllConversations = (state) => state.messages.conversations;
export const selectOnlineUsers = (state) => state.messages.onlineUsers;
export const selectActiveConversation = (state) =>
  state.messages.activeConversation;
export const selectMessagesByConversation = (state, conversationId) =>
  state.messages.messagesByConversation[conversationId] || [];
export const selectConversationStatus = (state) => state.messages.status;
export const selectConversationError = (state) => state.messages.error;
export const selectPagination = (state) => state.messages.pagination;
export const selectPinnedConversations = (state) =>
  state.messages.pinnedConversations;

export const isPinnedConversation = (state, conversationId) =>
  state.messages.pinnedConversations.includes(conversationId);
