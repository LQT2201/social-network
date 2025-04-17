import { initialState } from "./initialState";

export const setActiveConversation = (state, action) => {
  if (action.payload) {
    state.activeConversation = {
      ...initialState.activeConversation,
      ...action.payload,
    };

    const userId = localStorage.getItem("x-client-id");
    if (userId) {
      const currentParticipant = action.payload.participants?.find(
        (p) => p._id === userId
      );

      state.activeConversation.currentUser = currentParticipant
        ? currentParticipant
        : { _id: userId };
    }
  } else {
    state.activeConversation = initialState.activeConversation;
  }
};

export const setOnlineUsers = (state, action) => {
  const onlineUsers = action.payload;
  state.onlineUsers = onlineUsers;

  // Update participant status in conversations
  state.conversations.forEach((conversation) => {
    conversation.participants.forEach((participant) => {
      participant.isOnline = onlineUsers.includes(participant._id);
    });
  });
};

export const updateUserStatus = (state, action) => {
  const { userId, isOnline } = action.payload;

  // Update onlineUsers array
  if (isOnline) {
    if (!state.onlineUsers.includes(userId)) {
      state.onlineUsers.push(userId);
    }
  } else {
    state.onlineUsers = state.onlineUsers.filter((id) => id !== userId);
  }

  // Update participant status in conversations
  state.conversations.forEach((conversation) => {
    const participant = conversation.participants.find((p) => p._id === userId);
    if (participant) {
      participant.isOnline = isOnline;
    }
  });
};

export const sendMessage = (state, action) => {
  const { conversationId, message } = action.payload;

  // Ensure messages array exists for the conversation
  if (!state.messagesByConversation[conversationId]) {
    state.messagesByConversation[conversationId] = [];
  }

  // Add the message to the conversation's messages
  state.messagesByConversation[conversationId].push({
    ...message,
    status: "sending", // Mark as sending until confirmed by server
    isLocalMessage: true, // Mark as local message
  });

  // Update the conversation's lastMessage
  const conversation = state.conversations.find(
    (c) => c._id === conversationId
  );
  if (conversation) {
    conversation.lastMessage = {
      ...message,
      status: "sending",
      isLocalMessage: true,
    };
  }
};

export const addMessage = (state, action) => {
  const message = action.payload;
  const { conversation: conversationId } = message;

  // Update messagesByConversation
  if (!state.messagesByConversation[conversationId]) {
    state.messagesByConversation[conversationId] = [];
  }
  state.messagesByConversation[conversationId].push(message);

  // Update the conversation's lastMessage
  const conversation = state.conversations.find(
    (c) => c._id === conversationId
  );

  if (conversation) {
    conversation.lastMessage = message;
    // Update the conversation's unreadCount
    conversation.unreadCount[0].user = message.sender._id;

    if (conversation.unreadCount) {
      conversation.unreadCount = 0;
    }
  }
};

export const markMessagesAsRead = (state, action) => {
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
};

export const togglePinConversation = (state, action) => {
  const conversationId = action.payload;

  if (state.pinnedConversations.includes(conversationId)) {
    // Unpin conversation
    state.pinnedConversations = state.pinnedConversations.filter(
      (id) => id !== conversationId
    );
  } else {
    // Pin conversation
    state.pinnedConversations.push(conversationId);
  }

  // Safely update localStorage (only on client-side)
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        "pinnedConversations",
        JSON.stringify(state.pinnedConversations)
      );
    } catch (error) {
      console.error(
        "Error saving pinned conversations to localStorage:",
        error
      );
    }
  }
};
