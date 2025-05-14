import api from "./api";

export const userService = {
  // Get all users with pagination and search
  getAllUsers: async (queryParams = "") => {
    const response = await api.get(`/users?${queryParams}`);
    return response.data;
  },

  // Get a single user by ID
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Create a new user
  createUser: async (userData) => {
    const response = await api.post("/users", userData);
    return response.data;
  },

  // Update a user
  updateUser: async (id, userData) => {
    const response = await api.patch(`/users/${id}`, userData);
    return response.data;
  },

  // Delete a user
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Change user status (active/inactive)
  changeUserStatus: async (id, isActive) => {
    const response = await api.patch(`/users/${id}/status`, { isActive });
    return response.data;
  },
};

export default userService;
