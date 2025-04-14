import { createAsyncThunk } from "@reduxjs/toolkit";
import { MessageService } from "@/services/message.service";
import { toast } from "react-hot-toast";
import { togglePinConversation } from "./reducers";

export const fetchConversations = createAsyncThunk(
  "messages/fetchConversations",
  async ({ page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await MessageService.getConversations(page, limit);
      return response;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async ({ conversationId, page = 1, limit = 15 }, { rejectWithValue }) => {
    try {
      const response = await MessageService.getMessages(
        conversationId,
        page,
        limit
      );
      return { conversationId, ...response };
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const createConversation = createAsyncThunk(
  "messages/createConversation",
  async ({ participantId }, { rejectWithValue }) => {
    try {
      const response = await MessageService.createConversation(participantId);
      return response;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const markConversationAsRead = createAsyncThunk(
  "messages/markConversationAsRead",
  async ({ conversationId }, { rejectWithValue }) => {
    try {
      await MessageService.markAsRead(conversationId);
      return { conversationId };
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const togglePinConversationAsync = createAsyncThunk(
  "messages/togglePinConversation",
  async (conversationId, { dispatch, getState, rejectWithValue }) => {
    try {
      // Then make the API call
      const response = await MessageService.togglePinConversation(
        conversationId
      );

      return response;
    } catch (error) {
      // If the API call fails, revert the optimistic update
      dispatch(togglePinConversation(conversationId));
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPinnedConversations = createAsyncThunk(
  "messages/fetchPinnedConversations",
  async ({ page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await MessageService.getPinnedConversations(page, limit);
      return response;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);
