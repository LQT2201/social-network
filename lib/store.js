// src/lib/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/features/authSlice";
import postReducer from "@/redux/features/postSlice";
import commentsReducer from "@/redux/features/commentSlice";
import usersReducer from "@/redux/features/userSlice";
import messageReducer from "@/redux/features/message";
import profileReducer from "@/redux/features/profileSlice";

// Create a makeStore function
const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      posts: postReducer,
      comments: commentsReducer,
      user: usersReducer,
      messages: messageReducer,
      profile: profileReducer,
    },
    devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools in development
  });

// Optionally, export the store directly for non-SSR usage
export const store = makeStore();
