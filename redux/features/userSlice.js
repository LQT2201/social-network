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

const initialState = {
  user: null,
  status: "idle",
  error: null,
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
  },
});

// Actions
export const { setUser, clearUser, updateUser } = userSlice.actions;

// Selectors with memoization
export const selectUser = (state) => state.users.user;
export const selectUserStatus = (state) => state.users.status;
export const selectUserError = (state) => state.users.error;
export const selectIsAuthenticated = (state) => Boolean(state.users.user);
export const selectIsLoading = (state) => state.users.status === "loading";

export default userSlice.reducer;
