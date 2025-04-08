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

  async togglePinConversation(conversationId) {
    try {
      const response = await axios.patch(
        `/messages/conversations/${conversationId}/pin`
      );
      console.log("response", response);
      return response.data.metadata;
    } catch (error) {
      console.error("Error toggling pin status:", error);
      throw error.response?.data || error.message;
    }
  },

  async getPinnedConversations(page = 1, limit = 20) {
    try {
      const response = await axios.get(
        `/messages/conversations/pinned?page=${page}&limit=${limit}`
      );
      return response.data.metadata;
    } catch (error) {
      console.error("Error fetching pinned conversations:", error);
      throw error.response?.data || error.message;
    }
  },
};
