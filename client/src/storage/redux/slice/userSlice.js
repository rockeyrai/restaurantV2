// userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// loginUser async action
export const loginUser = createAsyncThunk(
  "/login",
  async (loginData, { rejectWithValue }) => {
    try {
      console.log("Login data:", loginData); // Debugging input
      const response = await axios.post(`${process.env.NEXT_PUBLIC_FRONTEND_API}/login`, loginData);
      return response.data; // Assuming the API returns token and user info
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message); // Log the error details
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoading: false,
    userInfo: null,
    token: null,
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      state.userInfo = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Only save specific fields (excluding password)
        const { username, user_id, token, role, phone_number } = action.payload.user;
        state.userInfo = { username, user_id, role, phone_number };
        state.token = action.payload.token; // Assuming the token is returned in the response
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Login failed"; // Use fallback error message
      });
  },
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
