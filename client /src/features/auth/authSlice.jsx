import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://192.168.0.115:5000/api/users";

export const login = createAsyncThunk("auth/login", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const signup = createAsyncThunk("auth/signup", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Signup failed");
  }
});

export const logout = createAsyncThunk("auth/logout", async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/logout?userId=${userId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Logout failed");
  }
});

export const getAllUsers = createAsyncThunk("auth/getAllUsers", async ({ page = 1, perPage = 10 }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/getAllUsers?page=${page}&perPage=${perPage}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      users: response.data.users,
      pagination: response.data.pagination,
    };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
  }
});

const initialState = {
  user: localStorage.getItem("userId") || null,
  id: localStorage.getItem("id"),
  connectionId: localStorage.getItem("connectionId"),
  status: "idle",
  error: null,
  usersList: [],
  pagination: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.userId;
        state.connectionId = action.payload.connectionId;
        state.id = action.payload.uuid;
        localStorage.setItem("userId", action.payload.userId);
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("connectionId", action.payload.connectionId);
        localStorage.setItem("id", action.payload.uuid);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(signup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "succeeded";
        state.user = null;
        localStorage.clear();
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.usersList = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetStatus, setUser } = authSlice.actions;
export default authSlice.reducer;