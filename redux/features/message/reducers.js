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
  state.onlineUsers = action.payload;
};

export const updateUserStatus = (state, action) => {
  const { userId, isOnline } = action.payload;
  // Update user status in conversations
  state.conversations.forEach((conversation) => {
    conversation.participants.forEach((participant) => {
      if (participant._id === userId) {
        participant.isOnline = isOnline;
      }
    });
  });
};

export const addMessage = (state, action) => {
  // Accept payload that has either a `message` property or a `content` field (for optimistic messages)
  const {
    conversationId,
    message: payloadMessage,
    isLocalMessage = false,
  } = action.payload;
  // If payloadMessage is not provided, construct it using content from payload
  const messageData = payloadMessage || { content: action.payload.content };

  // Ensure messages array exists for the conversation
  if (!state.messagesByConversation[conversationId]) {
    state.messagesByConversation[conversationId] = [];
  }

  // Use existing message._id if available; if not, generate a temporary id
  const generatedId =
    messageData._id ||
    `temp-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  // Check if a message with this ID already exists; if so, do nothing
  if (
    state.messagesByConversation[conversationId].some(
      (msg) => msg._id === generatedId
    )
  ) {
    return;
  }

  // Normalize the sender field, if provided
  const normalizedSender = messageData.sender
    ? typeof messageData.sender === "string"
      ? { _id: messageData.sender, username: "User" }
      : messageData.sender
    : null;

  // Create the new message object
  const newMessage = {
    _id: messageData._id || generatedId,
    sender: normalizedSender,
    content: messageData.content,
    createdAt: messageData.createdAt
      ? new Date(messageData.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: messageData.updatedAt || new Date().toISOString(),
    isEdited: messageData.isEdited || false,
    media: messageData.media || [],
    reactions: messageData.reactions || [],
    readBy: messageData.readBy || [],
    replyTo: messageData.replyTo || null,
    status: isLocalMessage ? "sending" : "sent",
    isLocalMessage,
  };

  // Add the new message to the conversation
  state.messagesByConversation[conversationId].push(newMessage);

  // Update the conversation's lastMessage if the conversation exists
  const conversation = state.conversations.find(
    (c) => c._id === conversationId
  );
  if (!conversation) return;

  conversation.lastMessage = newMessage;

  // Update unreadCount (using localStorage for current userId; ideally, pass this in via the action)
  const currentUserId = localStorage.getItem("x-client-id");
  if (
    currentUserId &&
    (!normalizedSender || normalizedSender._id !== currentUserId)
  ) {
    if (!Array.isArray(conversation.unreadCount)) {
      conversation.unreadCount = [];
    }
    const unreadEntry = conversation.unreadCount.find(
      (item) => item.user === currentUserId
    );
    if (unreadEntry) {
      unreadEntry.count = (parseInt(unreadEntry.count) || 0) + 1;
    } else {
      conversation.unreadCount.push({
        user: currentUserId,
        count: 1,
        _id: `${conversation._id}-${currentUserId}`,
      });
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
};
