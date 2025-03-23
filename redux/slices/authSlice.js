// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios"; // Sử dụng Axios instance đã cấu hình

// Async thunk để làm mới access token
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      // Lấy refreshToken từ localStorage
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await axios.post("/auth/handlerefreshtoken", {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk để xử lý đăng ký
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/auth/signup", userData);
      console.log("Register response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Register error:", error);
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        return rejectWithValue({ message: "Không thể kết nối đến server" });
      } else {
        return rejectWithValue({ message: "Đã xảy ra lỗi không xác định" });
      }
    }
  }
);

// Async thunk để xử lý đăng nhập
export const login = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/auth/signin", userData);
      console.log("Login response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        return rejectWithValue({ message: "Không thể kết nối đến server" });
      } else {
        return rejectWithValue({ message: "Đã xảy ra lỗi không xác định" });
      }
    }
  }
);

// Async thunk để xử lý đăng xuất
export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  return null;
});

// Khởi tạo initialState
const initialState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý registerUser
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.metadata.user;

        // Lưu token vào localStorage
        localStorage.setItem(
          "accessToken",
          action.payload.metadata.tokens.accessToken
        );
        localStorage.setItem(
          "refreshToken",
          action.payload.metadata.tokens.refreshToken
        );
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Đã xảy ra lỗi";
      })

      // Xử lý login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.metadata.user;

        // Lưu token vào localStorage
        localStorage.setItem(
          "accessToken",
          action.payload.metadata.tokens.accessToken
        );
        localStorage.setItem(
          "refreshToken",
          action.payload.metadata.tokens.refreshToken
        );
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Đã xảy ra lỗi";
      })

      // Xử lý logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { resetError, setUser } = authSlice.actions;
export default authSlice.reducer;
