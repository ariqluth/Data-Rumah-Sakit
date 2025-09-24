import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { API_BASE_URL } from "../../services/config";

const initialState = {
  isAuthenticated: false,
  profile: null,
  account: null,
  accessToken: null,
  status: "idle",
  error: null,
};

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { getState, rejectWithValue }) => {
    const { accessToken } = getState().auth;
    if (!accessToken) {
      return rejectWithValue("Access token missing");
    }
    try {
      const { data } = await axios.get(`${API_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return data;
    } catch (error) {
      const message = error.response?.data?.detail ?? error.message;
      return rejectWithValue(message);
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState().auth;
      if (!state.accessToken) {
        return false;
      }
      if (state.status === "loading") {
        return false;
      }
      return true;
    },
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticatedProfile: (state, action) => {
      state.isAuthenticated = true;
      state.profile = action.payload;
      state.error = null;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    clearAuthState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.account = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to load user";
      });
  },
});

export const { setAuthenticatedProfile, setAccessToken, clearAuthState } = authSlice.actions;

export const selectUserRole = (state) => state.auth.account?.role ?? null;
export const selectIsDokter = (state) => selectUserRole(state) === "dokter";
export const selectIsAdmin = (state) => selectUserRole(state) === "admin";

export default authSlice.reducer;
