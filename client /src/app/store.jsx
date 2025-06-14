import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import messageReducer from "../features/message/messageSlice"; // ✅ Import

const store = configureStore({
  reducer: {
    auth: authReducer,
    messages: messageReducer, // ✅ Add here
  },
});

export default store;