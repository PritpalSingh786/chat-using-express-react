// src/features/message/messageSlice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/messages";

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async ({ senderId, receiverId }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/messages/${senderId}/${receiverId}`);
      const formatted = res.data.map((msg) => {
        const time = new Date(Number(msg.createdAt));
        return {
          senderId: msg.senderId,
          text: msg.message,
          time: time.toLocaleTimeString(),
          date: time.toLocaleDateString(),
          isMe: msg.senderId === senderId,
        };
      });

      console.log("🟢 formatted messages from API", formatted);
      return formatted;
    } catch (err) {
      console.error("❌ fetchMessages error:", err);
      return rejectWithValue(err.response?.data || "Fetch error");
    }
  }
);


const messageSlice = createSlice({
  name: "messages",
  initialState: {
    messages: [],
    status: "idle",
    error: null,
  },
  reducers: {
    addReceivedMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
  },
});

export const { addReceivedMessage, clearMessages } = messageSlice.actions;

export default messageSlice.reducer;
