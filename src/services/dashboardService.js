const API_BASE_URL = "https://swift-aid-backend.onrender.com";

export const dashboardService = {
  async getDashboardData() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
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
