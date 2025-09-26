import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = import.meta.env.DEV
  ? "/api" // Use proxy in development
  : import.meta.env.VITE_API_BASE_URL || "https://swift-aid-backend.onrender.com";

// Async thunk for fetching ongoing emergencies
export const fetchOngoingEmergencies = createAsyncThunk(
  "ongoingEmergencies/fetchData",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(
        `${API_BASE_URL}/admin/emergencies/ongoing`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch ongoing emergencies"
        );
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to fetch ongoing emergencies"
      );
    }
  }
);

const initialState = {
  data: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
};

const ongoingEmergenciesSlice = createSlice({
  name: "ongoingEmergencies",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearData: (state) => {
      state.data = null;
      state.lastUpdated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOngoingEmergencies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOngoingEmergencies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchOngoingEmergencies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearData } = ongoingEmergenciesSlice.actions;
export default ongoingEmergenciesSlice.reducer;
