import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = import.meta.env.DEV
  ? "/api" // Use proxy in development
  : import.meta.env.VITE_API_BASE_URL || "https://swift-aid-backend.onrender.com";

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

// Async thunk to create a new responder
export const createResponder = createAsyncThunk(
  "responders/createResponder",
  async (responderData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${API_BASE_URL}/admin/responders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(responderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create responder");
      }

      const data = await response.json();
      return data.responder;
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
    creating: false,
    createError: null,
  },
  reducers: {
    setSelectedResponder: (state, action) => {
      state.selectedResponder = action.payload;
    },
    clearSelectedResponder: (state) => {
      state.selectedResponder = null;
    },
    clearCreateError: (state) => {
      state.createError = null;
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
      })
      .addCase(createResponder.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createResponder.fulfilled, (state, action) => {
        state.creating = false;
        state.data.push(action.payload);
      })
      .addCase(createResponder.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload;
      });
  },
});

export const {
  setSelectedResponder,
  clearSelectedResponder,
  clearCreateError,
} = respondersSlice.actions;
export default respondersSlice.reducer;
