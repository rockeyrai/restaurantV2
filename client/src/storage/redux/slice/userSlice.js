import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Login async action
export const loginUser = createAsyncThunk(
  "user/login",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_FRONTEND_API}/login`, loginData); // Replace with your API endpoint
      return response.data; // Assuming the API returns token and user info
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
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
        state.userInfo = action.payload.user; // Adjust based on API response
        state.token = action.payload.token;  // Adjust based on API response
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Login failed";
      });
  },
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
