import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PostService } from "@/services/post.service";

// Async thunks using service
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (params, { rejectWithValue }) => {
    try {
      return await PostService.fetchPosts(params);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Không thể kết nối đến server" }
      );
    }
  }
);

export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (postId, { rejectWithValue }) => {
    try {
      return await PostService.getPostById(postId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Không thể tải bài viết" }
      );
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (formData, { rejectWithValue }) => {
    try {
      return await PostService.createPost(formData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Không thể tạo bài viết" }
      );
    }
  }
);

export const likePost = createAsyncThunk(
  "posts/likePost",
  async (postId, { rejectWithValue }) => {
    try {
      const data = await PostService.likePost(postId);
      return { postId, data };
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
      await PostService.deletePost(postId);
      return postId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Không thể xóa bài viết" }
      );
    }
  }
);

const initialState = {
  items: [],
  status: "idle",
  error: null,
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
  activePost: {
    data: null,
    status: "idle",
    error: null,
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
    clearActivePost: (state) => {
      state.activePost = initialState.activePost;
    },
    cleảnSelectedPost: (state) => {
      state.selectedPost = null;
      state.selectedPostStatus = "idle";
      state.selectedPostError = null;
    },
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

      .addCase(fetchPostById.pending, (state) => {
        // Fetch Post By Id
        state.activePost.status = "loading";
        state.activePost.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.activePost.status = "succeeded";
        state.activePost.data = action.payload;
      })

      .addCase(fetchPostById.rejected, (state, action) => {
        state.activePost.status = "failed";
        state.activePost.error = action.payload?.message;
      });
  },
});

export const selectAllPosts = (state) => state.posts.items;
export const selectPostStatus = (state) => state.posts.status;
export const selectPostError = (state) => state.posts.error;
export const selectPagination = (state) => state.posts.pagination;
export const selectFilters = (state) => state.posts.filters;
export const selectPostDetails = (state) => state.posts.postDetails;

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

export const {
  setSelectedPost,
  updateFilters,
  resetError,
  resetPosts,
  clearActivePost,
} = postsSlice.actions;

export const selectSelectedPost = (state) => state.posts.selectedPost;
export const selectSelectedPostStatus = (state) =>
  state.posts.selectedPostStatus;
export const selectSelectedPostError = (state) => state.posts.selectedPostError;

export const selectActivePost = (state) => state.posts.activePost.data;
export const selectActivePostStatus = (state) => state.posts.activePost.status;
export const selectActivePostError = (state) => state.posts.activePost.error;

export { likePost as unlikePost };

export default postsSlice.reducer;
