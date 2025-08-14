import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching emergencies
export const fetchEmergencies = createAsyncThunk(
  "emergencies/fetchEmergencies",
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const queryParams = new URLSearchParams();

      // Add query parameters if provided
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value);
        }
      });

      const url = `/api/admin/emergencies${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const emergenciesSlice = createSlice({
  name: "emergencies",
  initialState: {
    emergencies: [],
    pagination: {
      current_page: 1,
      total_pages: 1,
      total_count: 0,
      per_page: 20,
    },
    filters: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    resetEmergencies: (state) => {
      state.emergencies = [];
      state.pagination = {
        current_page: 1,
        total_pages: 1,
        total_count: 0,
        per_page: 20,
      };
      state.filters = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmergencies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmergencies.fulfilled, (state, action) => {
        state.loading = false;
        state.emergencies = action.payload.emergencies;
        state.pagination = action.payload.pagination;
        state.filters = action.payload.filters;
      })
      .addCase(fetchEmergencies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch emergencies";
      });
  },
});

export const { clearError, setFilters, clearFilters, resetEmergencies } =
  emergenciesSlice.actions;

export default emergenciesSlice.reducer;
