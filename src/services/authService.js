// Authentication service for Swift Aid Backend API
const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:5173/api" // Use proxy in development
  : "https://swift-aid-backend.onrender.com"; // Direct URL in production

class AuthService {
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        credentials: "omit",
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error messages from the server
        throw new Error(data.message || "Login failed");
      }

      // Transform the API response to match our expected structure
      return {
        user: {
          id: data.admin.admin_id,
          name: data.admin.name,
          email: data.admin.email,
          phone: data.admin.phone,
          badgeNumber: data.admin.badgeNumber,
          role: data.admin.role,
          agency: data.admin.agency,
        },
        token: data.token,
        refreshToken: null, // API doesn't provide refresh token
      };
    } catch (error) {
      // If CORS is still an issue, provide more specific error handling
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error(
          "Unable to connect to server. Please check your internet connection or try again later."
        );
      }
      console.error("Login error:", error.message);
      throw new Error(error.message || "Login failed");
    }
  }

  async logout() {
    try {
      // Since there's no logout endpoint mentioned, we'll just clear local storage
      // If you have a logout endpoint later, uncomment and modify the code below:
      // const token = localStorage.getItem("token");
      // if (token) {
      //   await fetch(`${API_BASE_URL}/admin/auth/logout`, {
      //     method: "POST",
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "application/json",
      //     },
      //   });
      // }
    } catch (error) {
      console.warn("Logout API call failed, proceeding with local logout");
    }

    // Always clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }

  async refreshToken() {
    // Since the API doesn't provide refresh tokens, we'll skip this functionality
    // If you implement refresh tokens later, update this method
    throw new Error("Token refresh not implemented");
  }

  async validateToken(token) {
    try {
      // Since there's no specific token validation endpoint mentioned,
      // we'll assume the token is valid if it exists and hasn't expired
      // You can add a specific validation endpoint later if needed
      if (!token) return false;

      // Basic JWT expiration check (optional)
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Date.now() / 1000;
        return payload.exp > now;
      } catch {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  // Utility method to check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem("token");
    return !!token;
  }

  // Get current user from localStorage
  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  // Get token from localStorage
  getToken() {
    return localStorage.getItem("token");
  }
}

export const authService = new AuthService();
