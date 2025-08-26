import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = import.meta.env.DEV
  ? "/api" // Use proxy in development
  : "https://swift-aid-backend.onrender.com";

// Async thunk to fetch responders
export const fetchResponders = createAsyncThunk(
  "responders/fetchResponders",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${API_BASE_URL}/admin/responders`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch responders");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const respondersSlice = createSlice({
  name: "responders",
  initialState: {
    data: [],
    loading: false,
    error: null,
    selectedResponder: null,
  },
  reducers: {
    setSelectedResponder: (state, action) => {
      state.selectedResponder = action.payload;
    },
    clearSelectedResponder: (state) => {
      state.selectedResponder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResponders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResponders.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchResponders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedResponder, clearSelectedResponder } =
  respondersSlice.actions;
export default respondersSlice.reducer;
