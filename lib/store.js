// src/lib/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/features/authSlice";
import postReducer from "@/redux/features/postSlice";

// Create a makeStore function
const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      posts: postReducer,
    },
    devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools in development
  });

// Optionally, export the store directly for non-SSR usage
export const store = makeStore();
