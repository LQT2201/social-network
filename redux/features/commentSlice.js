import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CommentService } from "@/services/comment.service";

const initialState = {
  byPostId: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  status: "idle",
  error: null,
};

export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ postId, content, parentComment }, { rejectWithValue }) => {
    try {
      const comment = await CommentService.addComment(
        postId,
        content,
        parentComment
      );
      return { postId, comment };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Không thể thêm bình luận" }
      );
    }
  }
);

export const replyComment = createAsyncThunk(
  "comments/replyComment",
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const reply = await CommentService.replyToComment(commentId, content);
      const postId = reply.post._id || reply.post; // Lấy postId từ reply

      return { reply, postId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Không thể trả lời bình luận" }
      );
    }
  }
);

export const fetchPostComments = createAsyncThunk(
  "comments/fetchByPostId",
  async ({ postId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await CommentService.getPostComments(
        postId,
        page,
        limit
      );
      return {
        postId,
        comments: response.metadata.comments,
        pagination: response.metadata.pagination,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Không thể tải bình luận" }
      );
    }
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearComments: (state) => {
      state.byPostId = {};
      state.pagination = initialState.pagination;
      state.status = "idle";
      state.error = null;
    },
    clearPostComments: (state, action) => {
      delete state.byPostId[action.payload];
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostComments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPostComments.fulfilled, (state, action) => {
        state.status = "succeeded";
        // If it's first page, replace comments, otherwise append
        if (action.payload.pagination.page === 1) {
          state.byPostId[action.payload.postId] = action.payload.comments;
        } else {
          state.byPostId[action.payload.postId] = [
            ...(state.byPostId[action.payload.postId] || []),
            ...action.payload.comments,
          ];
        }
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPostComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;

        if (state.byPostId[postId]) {
          // Add new comment at the beginning of the list
          state.byPostId[postId].unshift(comment);
          // Update total count
          state.pagination.total += 1;
        }
      })
      .addCase(replyComment.fulfilled, (state, action) => {
        const { reply, postId } = action.payload;

        if (state.byPostId[postId]) {
          // Add reply to comments array
          state.byPostId[postId].unshift(reply);

          console.log("reply", reply.parentComment._id);
          // Update parent comment's replies array
          const parentIndex = state.byPostId[postId].findIndex(
            (c) => c._id === reply.parentComment._id
          );

          if (parentIndex !== -1) {
            state.byPostId[postId][parentIndex].replies.push(reply._id);
          }

          console.log("parentIndex", state.byPostId[postId][parentIndex]);
        }
      });
  },
});

// Updated selectors
export const selectCommentsByPostId = (state, postId) =>
  state.comments.byPostId[postId] || [];
export const selectCommentsStatus = (state) => state.comments.status;
export const selectCommentsError = (state) => state.comments.error;
export const selectCommentsPagination = (state) => state.comments.pagination;

export const { clearComments, clearPostComments, setPage } =
  commentsSlice.actions;
export default commentsSlice.reducer;
