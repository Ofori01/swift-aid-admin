const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://swift-aid-backend.onrender.com";

// In development, use proxy; in production, use direct API calls
const getApiUrl = (endpoint) => {
  if (import.meta.env.DEV) {
    return `/api${endpoint}`;
  }
  return `${API_BASE_URL}${endpoint}`;
};

export const dashboardService = {
  async getDashboardData() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(getApiUrl("/admin/dashboard"), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token might be expired, remove it
          localStorage.removeItem("token");
          throw new Error("Authentication failed. Please login again.");
        }
        throw new Error(
          `Dashboard request failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Dashboard service error:", error);
      throw error;
    }
  },
};
