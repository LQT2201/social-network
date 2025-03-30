import axios from "@/lib/axios";

export const PostService = {
  async fetchPosts({ page = 1, limit = 10, visibility = "public" }) {
    const response = await axios.get("/posts", {
      params: { page, limit, visibility },
    });
    return response.data.metadata;
  },

  async createPost(formData) {
    const response = await axios.post("/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.metadata;
  },

  async getPostById(postId) {
    const response = await axios.get(`/posts/${postId}`);
    return response.data.metadata;
  },

  async likePost(postId) {
    const response = await axios.post(`/posts/${postId}/like`);
    return response.data.metadata;
  },

  async deletePost(postId) {
    await axios.delete(`/posts/${postId}`);
    return postId;
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
};
