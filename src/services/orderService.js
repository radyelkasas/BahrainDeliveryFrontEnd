import api from "./api";
import userService from "./userService";

/**
 * Service for handling order-related API calls
 */
const orderService = {
  // Get order statistics
  getOrderStats: async () => {
    const response = await api.get("/orders/stats");
    return response.data;
  },

  // Get all orders with pagination and optional filters
  getAllOrders: async (page = 1, limit = 10, filters = {}) => {
    // Build the query string from filters
    let queryParams = `page=${page}&limit=${limit}`;

    // Add order status filter if provided
    if (filters.status) {
      queryParams += `&status=${filters.status}`;
    }

    // Add payment method filter if provided
    if (filters.paymentMethod) {
      queryParams += `&paymentMethod=${filters.paymentMethod}`;
    }

    // Add payment status filter if provided
    if (filters.paymentStatus) {
      queryParams += `&paymentStatus=${filters.paymentStatus}`;
    }

    // Add search filter if provided
    if (filters.search) {
      queryParams += `&search=${encodeURIComponent(filters.search)}`;
    }

    // Add company filter if provided
    if (filters.company) {
      queryParams += `&company=${filters.company}`;
    }

    // Add active filter if provided
    if (filters.active !== undefined) {
      queryParams += `&active=${filters.active}`;
    }

    // Add sort parameter if provided
    if (filters.sort) {
      queryParams += `&sort=${filters.sort}`;
    }

    const response = await api.get(`/orders?${queryParams}`);
    return response.data;
  },

  // Get a single order by ID
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Create a new order
  createOrder: async (orderData) => {
    const response = await api.post("/orders", orderData);
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (id, orderStatus) => {
    const response = await api.patch(`/orders/${id}/status`, { orderStatus });
    return response.data;
  },

  // Update payment status
  updatePaymentStatus: async (id, paymentData) => {
    const response = await api.patch(`/orders/${id}/payment`, paymentData);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id) => {
    const response = await api.patch(`/orders/${id}/cancel`);
    return response.data;
  },

  // Get all companies (users with role=company)
  getCompanies: async () => {
    const response = await userService.getAllUsers("role=company");
    return response;
  },
};

export default orderService;
