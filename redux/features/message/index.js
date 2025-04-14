import { createSlice } from "@reduxjs/toolkit";
import * as reducers from "./reducers";
import { buildExtraReducers } from "./extraReducers";
import { initialState } from "./initialState";

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: reducers,
  extraReducers: buildExtraReducers,
});

export const {
  setActiveConversation,
  setOnlineUsers,
  updateUserStatus,
  addMessage,
  sendMessage,
  markMessagesAsRead,
  togglePinConversation,
} = messageSlice.actions;

// Export selectors
export * from "./selectors";

// Export thunks
export * from "./thunks";

export default messageSlice.reducer;
