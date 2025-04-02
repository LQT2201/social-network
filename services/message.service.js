import axios from "@/lib/axios";

export const MessageService = {
  async getConversations(page = 1, limit = 20) {
    const response = await axios.get("/messages/conversations", {
      params: { page, limit },
    });

    return response.data.metadata;
  },

  async getMessages(conversationId, page = 1, limit = 20) {
    const response = await axios.get(`/messages/${conversationId}/messages`, {
      params: { page, limit },
    });
    return response.data.metadata;
  },

  async createMessage({ conversationId, content, media, replyTo }) {
    const response = await axios.post("/messages/send", {
      conversationId,
      content,
      media: media || [],
      replyTo,
    });

    return response.data.metadata;
  },

  async createConversation(participantId) {
    const response = await axios.post("/messages/conversations", {
      participantId,
    });

    return response.data.metadata;
  },

  async markAsRead(conversationId) {
    const response = await axios.patch(`/messages/${conversationId}/read`);
    return response.data.metadata;
  },

  async addReaction(messageId, type) {
    const response = await axios.post(
      `/messages/messages/${messageId}/reactions`,
      {
        type,
      }
    );
    return response.data.metadata;
  },

  async deleteMessage(messageId) {
    const response = await axios.delete(`/messages/messages/${messageId}`);
    return response.data.metadata;
  },

  async editMessage(messageId, content) {
    const response = await axios.patch(`/messages/messages/${messageId}`, {
      content,
    });
    return response.data.metadata;
  },
};
