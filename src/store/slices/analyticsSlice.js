import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://swift-aid-backend.onrender.com";

// In development, use proxy; in production, use direct API calls
const getApiUrl = (endpoint) => {
  if (import.meta.env.DEV) {
    return `/api${endpoint}`;
  }
  return `${API_BASE_URL}${endpoint}`;
};

// Async thunks for API calls
export const fetchAnalytics = createAsyncThunk(
  "analytics/fetchAnalytics",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch(getApiUrl("/admin/analytics"), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData.message || "Failed to fetch analytics"
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

export const fetchResponseTimes = createAsyncThunk(
  "analytics/fetchResponseTimes",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch(
        getApiUrl("/admin/analytics/response-times"),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData.message || "Failed to fetch response times"
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

export const fetchResponderUtilization = createAsyncThunk(
  "analytics/fetchResponderUtilization",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch(
        getApiUrl("/admin/analytics/responder-utilization"),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData.message || "Failed to fetch responder utilization"
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

const initialState = {
  // General analytics data
  analytics: null,
  responseTimesData: null,
  responderUtilizationData: null,

  // Loading states
  loading: false,
  responseTimesLoading: false,
  responderUtilizationLoading: false,

  // Error states
  error: null,
  responseTimesError: null,
  responderUtilizationError: null,

  // Meta data
  lastUpdated: null,
  period: "30 days",
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.responseTimesError = null;
      state.responderUtilizationError = null;
    },
    setPeriod: (state, action) => {
      state.period = action.payload;
    },
    clearAnalytics: (state) => {
      state.analytics = null;
      state.responseTimesData = null;
      state.responderUtilizationData = null;
      state.error = null;
      state.responseTimesError = null;
      state.responderUtilizationError = null;
      state.lastUpdated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Analytics
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch analytics";
        state.analytics = null;
      })

      // Fetch Response Times
      .addCase(fetchResponseTimes.pending, (state) => {
        state.responseTimesLoading = true;
        state.responseTimesError = null;
      })
      .addCase(fetchResponseTimes.fulfilled, (state, action) => {
        state.responseTimesLoading = false;
        state.responseTimesData = action.payload;
        state.responseTimesError = null;
      })
      .addCase(fetchResponseTimes.rejected, (state, action) => {
        state.responseTimesLoading = false;
        state.responseTimesError =
          action.payload || "Failed to fetch response times";
        state.responseTimesData = null;
      })

      // Fetch Responder Utilization
      .addCase(fetchResponderUtilization.pending, (state) => {
        state.responderUtilizationLoading = true;
        state.responderUtilizationError = null;
      })
      .addCase(fetchResponderUtilization.fulfilled, (state, action) => {
        state.responderUtilizationLoading = false;
        state.responderUtilizationData = action.payload;
        state.responderUtilizationError = null;
      })
      .addCase(fetchResponderUtilization.rejected, (state, action) => {
        state.responderUtilizationLoading = false;
        state.responderUtilizationError =
          action.payload || "Failed to fetch responder utilization";
        state.responderUtilizationData = null;
      });
  },
});

export const { clearError, setPeriod, clearAnalytics } = analyticsSlice.actions;

export default analyticsSlice.reducer;
