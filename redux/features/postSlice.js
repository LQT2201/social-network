import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";

// Async thunks
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (
    { page = 1, limit = 10, visibility = "public" },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get("/posts", {
        params: { page, limit, visibility },
      });
      // Return only metadata from response
      return response.data.metadata;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Không thể kết nối đến server" });
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.metadata;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Không thể tạo bài viết" });
    }
  }
);

export const likePost = createAsyncThunk(
  "posts/likePost",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/posts/${postId}/like`);
      return { postId, data: response.data.metadata };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Không thể thực hiện thao tác" }
      );
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      await axios.delete(`/posts/${postId}`);
      return postId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Không thể xóa bài viết" }
      );
    }
  }
);

// Add new thunk for creating comments
export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, content, parentComment }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/comments/posts/${postId}/comments`, {
        content,
        parentComment,
      });
      return {
        postId,
        comment: response.data.metadata,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Không thể thêm bình luận" }
      );
    }
  }
);

// Add new thunk for fetching comments
export const fetchComments = createAsyncThunk(
  "posts/fetchComments",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/comments/posts/${postId}/comments`);
      return response.data.metadata;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Không thể tải bình luận" }
      );
    }
  }
);

export const replyComment = createAsyncThunk(
  "posts/replyComment",
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `/comments/comments/${commentId}/reply`,
        {
          content,
        }
      );
      return response.data.metadata;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Không thể trả lời bình luận" }
      );
    }
  }
);

const initialState = {
  items: [],
  status: "idle",
  error: null,
  selectedPost: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {
    sort: "-createdAt",
    visibility: "public",
  },
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetError: (state) => {
      state.error = null;
    },
    resetPosts: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Handle nested metadata structure
        const { posts, pagination } = action.payload;

        // Append or replace posts based on page number
        if (pagination.page > 1) {
          state.items = [...state.items, ...posts];
        } else {
          state.items = posts;
        }

        state.pagination = pagination;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Không thể tải bài viết";
      })

      // Create Post
      .addCase(createPost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Không thể tạo bài viết";
      })

      // Like Post
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.items.find((p) => p._id === action.payload.postId);
        if (post) {
          post.stats = action.payload.data.stats;
        }
      })

      // Delete Post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter((post) => post._id !== action.payload);
        state.pagination.total -= 1;
      })

      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        const post = state.items.find((p) => p._id === action.payload.postId);
        if (post) {
          post.stats.comments.push(action.payload.comment);
        }
      })

      // Reply Comment
      .addCase(replyComment.fulfilled, (state, action) => {
        const post = state.items.find((p) => p._id === action.payload.post);
        if (post) {
          post.stats.comments.push(action.payload);
        }
      })

      // Fetch Comments
      .addCase(fetchComments.fulfilled, (state, action) => {
        const post = state.items.find((p) => p._id === action.payload.postId);
        if (post) {
          post.stats.comments = action.payload.comments;
        }
      });
  },
});

export const selectAllPosts = (state) => state.posts.items;
export const selectPostStatus = (state) => state.posts.status;
export const selectPostError = (state) => state.posts.error;
export const selectPagination = (state) => state.posts.pagination;
export const selectFilters = (state) => state.posts.filters;

// Add new selectors for specific post data
export const selectPostComments = (state, postId) => {
  const post = state.posts.items.find((p) => p._id === postId);
  return post?.stats?.comments || [];
};

export const selectPostLikes = (state, postId) => {
  const post = state.posts.items.find((p) => p._id === postId);
  return post?.stats?.likes || [];
};

export const selectPostMetadata = (state, postId) => {
  const post = state.posts.items.find((p) => p._id === postId);
  return post?.metadata || { tags: [], location: null };
};

export const selectPostById = (state, postId) =>
  state.posts.items.find((post) => post._id === postId);

export const { setSelectedPost, updateFilters, resetError, resetPosts } =
  postsSlice.actions;

export default postsSlice.reducer;
