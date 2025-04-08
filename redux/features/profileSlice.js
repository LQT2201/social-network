import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ProfileService from "@/services/profile.service";
import { toast } from "react-hot-toast";

// Async thunks
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await ProfileService.getProfile(userId);

      return response;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const response = await ProfileService.updateProfile(userId, data);
      toast.success("Profile updated successfully");
      return response;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const followUser = createAsyncThunk(
  "profile/followUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await ProfileService.followUser(userId);

      return response;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error);
    }
  }
);

export const unfollowUser = createAsyncThunk(
  "profile/unfollowUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await ProfileService.unfollowUser(userId);
      return response;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const getFollowingUsers = createAsyncThunk(
  "profile/getFollowingUsers",
  async ({ userId, page = 1, limit = 10 }, { rejectWithValue }) => {
    const response = await ProfileService.getFollowingUsers(
      userId,
      page,
      limit
    );
    return response.following;
  }
);

export const getFollowersUsers = createAsyncThunk(
  "profile/getFollowersUsers",
  async ({ userId, page = 1, limit = 10 }, { rejectWithValue }) => {
    const response = await ProfileService.getFollowersUsers(
      userId,
      page,
      limit
    );
    return response.followers;
  }
);

const initialState = {
  profile: null,
  status: "idle",
  error: null,
  followers: [],
  following: [],
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetProfile: (state) => {
      state.profile = null;
      state.status = "idle";
      state.error = null;
      state.followers = [];
      state.following = [];
    },
    updateFollowers: (state, action) => {
      const index = state.profile.followers.findIndex(
        (follower) => follower === action.payload
      );

      if (index === -1) {
        state.profile.followers.push(action.payload);
      } else state.profile.followers.splice(index, 1);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Follow User - status update only. Followers will be updated via getFollowersUsers thunk.
      .addCase(followUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(followUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(followUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Unfollow User - status update only. Followers will be updated via getFollowersUsers thunk.
      .addCase(unfollowUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(unfollowUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Get Following Users
      .addCase(getFollowingUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getFollowingUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.following = action.payload;
      })
      .addCase(getFollowingUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Get Followers Users
      .addCase(getFollowersUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getFollowersUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.followers = action.payload;
      })
      .addCase(getFollowersUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectProfile = (state) => state.profile.profile;
export const selectStatus = (state) => state.profile.status;
export const selectError = (state) => state.profile.error;
export const selectFollowers = (state) => state.profile.followers;
export const selectFollowing = (state) => state.profile.following;
export const { resetProfile, updateFollowers } = profileSlice.actions;
export default profileSlice.reducer;
