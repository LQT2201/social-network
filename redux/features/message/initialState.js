// Helper function to load pinned conversations from localStorage
const loadPinnedConversationsFromStorage = () => {
  try {
    const pinnedConversations = localStorage.getItem("pinnedConversations");
    return pinnedConversations ? JSON.parse(pinnedConversations) : [];
  } catch (error) {
    console.error(
      "Error loading pinned conversations from localStorage:",
      error
    );
    return [];
  }
};

export const initialState = {
  conversations: [],
  activeConversation: null,
  messagesByConversation: {},
  onlineUsers: [],
  status: "idle",
  error: null,
  pagination: {},
  pinnedConversations: loadPinnedConversationsFromStorage(),
};
