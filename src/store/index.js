import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import dashboardReducer from "./slices/dashboardSlice";
import emergenciesReducer from "./slices/emergenciesSlice";
import analyticsReducer from "./slices/analyticsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    emergencies: emergenciesReducer,
    analytics: analyticsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: import.meta.env.MODE !== "production",
});
