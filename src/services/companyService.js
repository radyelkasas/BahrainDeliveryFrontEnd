import api from "./api";

export const companyService = {
  // Get all companies with pagination
  getAllCompanies: async (queryParams = "") => {
    const response = await api.get(`/admin/companies?${queryParams}`);
    return response.data;
  },

  // Get a single company by ID
  getCompanyById: async (id) => {
    const response = await api.get(`/admin/companies/${id}`);
    return response.data;
  },

  // Create a new company
  createCompany: async (companyData) => {
    const response = await api.post("/admin/companies", companyData);
    return response.data;
  },

  // Update a company
  updateCompany: async (id, companyData) => {
    const response = await api.patch(`/admin/companies/${id}`, companyData);
    return response.data;
  },

  // Delete a company
  deleteCompany: async (id) => {
    const response = await api.delete(`/admin/companies/${id}`);
    return response.data;
  },

  // Change company status (active/inactive)
  changeCompanyStatus: async (id, isActive) => {
    const response = await api.patch(`/admin/companies/${id}/status`, {
      isActive,
    });
    return response.data;
  },
};

export default companyService;
