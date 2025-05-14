import axios from "axios";

// Create an axios instance with base URL and default headers
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add authorization token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token expiration and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized responses by redirecting to login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Authentication services
export const authService = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.patch("/auth/updateprofile", profileData);
    if (response.data.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Update user password
  updatePassword: async (passwordData) => {
    const response = await api.patch("/auth/updatepassword", passwordData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  // Request password reset
  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgotpassword", { email });
    return response.data;
  },

  // Reset password with token
  resetPassword: async (token, password) => {
    const response = await api.patch(`/auth/resetpassword/${token}`, {
      password,
    });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  // Get authenticated user
  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

export default api;
