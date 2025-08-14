import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import { store } from "@/store";
import Dashboard from "./pages/dashboard/Dashboard";
import Emergencies from "./pages/emergency/Emergencies";
import Analytics from "./pages/analytics/Analytics";
import Layout from "./pages/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <ProtectedRoute>
          <Routes>
            <Route path="/*" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="emergencies" element={<Emergencies />} />
              <Route path="emergency/:emergency_id" element={<Emergencies />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>
          </Routes>
        </ProtectedRoute>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
