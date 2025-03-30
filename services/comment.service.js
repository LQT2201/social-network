import axios from "@/lib/axios";

export const CommentService = {
  async getPostComments(postId, page = 1, limit = 10) {
    const response = await axios.get(`/comments/posts/${postId}/comments`, {
      params: { page, limit },
    });
    return response.data;
  },

  async addComment(postId, content, parentComment) {
    const response = await axios.post(`/comments/posts/${postId}/comments`, {
      content,
      parentComment,
    });
    return response.data.metadata;
  },

  async replyToComment(commentId, content) {
    const response = await axios.post(`/comments/comments/${commentId}/reply`, {
      content,
    });
    return response.data.metadata;
  },

  async likeComment(commentId) {
    const response = await axios.post(`/comments/${commentId}/like`);
    return response.data.metadata;
  },
};
