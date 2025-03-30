import { axiosInstance } from "@/lib/axios";

export const MessageService = {
  async getConversations(page = 1, limit = 20) {
    const response = await axiosInstance.get(`/messages/conversations`, {
      params: { page, limit },
    });
    return response.data;
  },

  async getMessages(conversationId, page = 1, limit = 20) {
    const response = await axiosInstance.get(`/messages/${conversationId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  async createMessage({ conversationId, content, media, replyTo }) {
    const response = await axiosInstance.post(`/messages/send`, {
      conversationId,
      content,
      media,
      replyTo,
    });
    return response.data;
  },

  async markAsRead(conversationId) {
    const response = await axiosInstance.patch(
      `/messages/${conversationId}/read`
    );
    return response.data;
  },
};
