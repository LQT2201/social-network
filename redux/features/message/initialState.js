// Wrap localStorage access in a function that checks if running on client-side
const getInitialPinnedConversations = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const pinnedConversationsJSON = localStorage.getItem("pinnedConversations");
    return pinnedConversationsJSON ? JSON.parse(pinnedConversationsJSON) : [];
  } catch (error) {
    console.error(
      "Error loading pinned conversations from localStorage:",
      error
    );
    return [];
  }
};

export const initialState = {
  activeConversation: {
    _id: null,
    participants: [],
    createdAt: null,
    updatedAt: null,
    lastMessage: null,
    unreadCount: null,
    currentUser: null,
  },
  conversations: [],
  messagesByConversation: {},
  onlineUsers: [],
  pinnedConversations: getInitialPinnedConversations(),
  error: null,
  status: "idle",
};
