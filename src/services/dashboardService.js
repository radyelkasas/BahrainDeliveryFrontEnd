import api from "./api";

/**
 * Service for handling dashboard-related API calls
 */
const dashboardService = {
  // Get dashboard overview data (all stats, recent orders, and sales by month)
  getDashboardOverview: async () => {
    const response = await api.get("/dashboard/overview");
    return response.data;
  },
};

export default dashboardService;
