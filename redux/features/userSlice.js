import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserService } from "@/services/user.service";
import { toast } from "react-hot-toast";

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
      return response.metadata;
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
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to fetch users");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getFollowingUsers = createAsyncThunk(
  "user/getFollowingUsers",
  async ({ page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await UserService.getFollowingUsers(page, limit);
      return response.metadata;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch following users"
      );
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  user: null,
  status: "idle",
  error: null,
  searchResults: {
    users: [],
    pagination: null,
  },
  allUsers: {
    users: [],
    pagination: null,
  },
  followingUsers: {
    users: [],
    pagination: null,
  },
  searchStatus: "idle",
  allUsersStatus: "idle",
  followingStatus: "idle",
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
      });

    // Search Users
    builder
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
      });

    // Get All Users
    builder
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
      });

    // Get Following Users
    builder
      .addCase(getFollowingUsers.pending, (state) => {
        state.followingStatus = "loading";
      })
      .addCase(getFollowingUsers.fulfilled, (state, action) => {
        state.followingStatus = "succeeded";
        state.followingUsers = action.payload;
      })
      .addCase(getFollowingUsers.rejected, (state, action) => {
        state.followingStatus = "failed";
        state.error = action.payload;
      });
  },
});

// Actions
export const { setUser, clearUser, updateUser, clearSearchResults } =
  userSlice.actions;

// Selectors with memoization
export const selectUser = (state) => state.users.user;
export const selectUserStatus = (state) => state.users.status;
export const selectUserError = (state) => state.users.error;
export const selectIsAuthenticated = (state) => Boolean(state.users.user);
export const selectIsLoading = (state) => state.users.status === "loading";

// Additional Selectors
export const selectSearchResults = (state) => state.users.searchResults;
export const selectSearchStatus = (state) => state.users.searchStatus;
export const selectAllUsers = (state) => state.users.allUsers;
export const selectAllUsersStatus = (state) => state.users.allUsersStatus;
export const selectFollowingUsers = (state) => state.users.followingUsers;
export const selectFollowingStatus = (state) => state.users.followingStatus;

export default userSlice.reducer;
