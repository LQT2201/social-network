import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserService } from "@/services/user.service";
import { toast } from "react-hot-toast";

export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (userId, { rejectWithValue }) => {
    const response = await UserService.getUserById(userId);
    return response;
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const metadata = await UserService.getCurrentUser();
      return metadata;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Không thể tải thông tin người dùng"
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

export const searchUsers = createAsyncThunk(
  "user/searchUsers",
  async ({ query, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await UserService.searchUsers(query, page, limit);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to search users");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async ({ page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await UserService.getAllUsers(page, limit);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getRecommendUsers = createAsyncThunk(
  "user/getRecommendUsers",
  async (_, { rejectWithValue }) => {
    const response = await UserService.getRecommendUsers();
    return response;
  }
);

const initialState = {
  user: null,
  status: "idle",
  error: null,
  recommendUsers: {
    users: [],
    pagination: null,
  },
  searchResults: {
    users: [],
    pagination: null,
  },
  allUsers: {
    users: [],
    pagination: null,
  },
  searchStatus: "idle",
  allUsersStatus: "idle",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    clearSearchResults: (state) => {
      state.searchResults = { users: [], pagination: null };
      state.searchStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
        state.user = null;
      })
      .addCase(searchUsers.pending, (state) => {
        state.searchStatus = "loading";
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.searchStatus = "succeeded";
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.searchStatus = "failed";
        state.error = action.payload;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.allUsersStatus = "loading";
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.allUsersStatus = "succeeded";
        state.allUsers = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.allUsersStatus = "failed";
        state.error = action.payload;
      })
      .addCase(getRecommendUsers.pending, (state) => {
        state.recommendUsers.status = "loading";
      })
      .addCase(getRecommendUsers.fulfilled, (state, action) => {
        state.recommendUsers.status = "succeeded";
        state.recommendUsers.users = action.payload;
      })
      .addCase(getRecommendUsers.rejected, (state, action) => {
        state.recommendUsers.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setUser, clearUser, updateUser, clearSearchResults } =
  userSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectUserStatus = (state) => state.user.status;
export const selectUserError = (state) => state.user.error;
export const selectIsAuthenticated = (state) => Boolean(state.user.user);
export const selectIsLoading = (state) => state.user.status === "loading";
export const selectSearchResults = (state) => state.user.searchResults;
export const selectSearchStatus = (state) => state.user.searchStatus;
export const selectAllUsers = (state) => state.user.allUsers;
export const selectAllUsersStatus = (state) => state.user.allUsersStatus;
export const selectRecommendUsers = (state) => state.user.recommendUsers.users;
export const selectRecommendUsersStatus = (state) =>
  state.user.recommendUsers.status;
export default userSlice.reducer;
