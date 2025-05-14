import api from "./api";

/**
 * Category Service
 *
 * Provides functions to interact with the categories API endpoints
 * including search functionality, filtering, and CRUD operations.
 */
export const categoryService = {
  /**
   * Get all categories with pagination, optional active filter, and search
   *
   * @param {number} page - Current page number (default: 1)
   * @param {number} limit - Number of items per page (default: 10)
   * @param {boolean|null} active - Filter by active status (true/false/null)
   * @param {string} search - Search term to filter categories
   * @returns {Promise} Promise resolving to the API response with categories data
   */
  getAllCategories: async (
    page = 1,
    limit = 10,
    active = null,
    search = "",
    companyId = null
  ) => {
    // Build the query parameters
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);

    // Only add active parameter if it's not null
    if (active !== null) {
      params.append("active", active);
    }

    // Add search parameter if provided
    if (search && search.trim() !== "") {
      params.append("search", search.trim());
    }

    // Add company parameter if provided (for company role users)
    if (companyId) {
      params.append("company", companyId);
    }

    // Make the API request with all parameters
    const response = await api.get(`/categories?${params.toString()}`);
    return response.data;
  },

  /**
   * Get a single category by ID
   *
   * @param {string} id - Category ID
   * @returns {Promise} Promise resolving to the API response with category data
   */
  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  /**
   * Create a new category
   *
   * @param {Object} categoryData - Category data object
   * @returns {Promise} Promise resolving to the API response
   */
  createCategory: async (categoryData) => {
    const response = await api.post("/categories", categoryData);
    return response.data;
  },

  /**
   * Update an existing category
   *
   * @param {string} id - Category ID
   * @param {Object} categoryData - Updated category data
   * @returns {Promise} Promise resolving to the API response
   */
  updateCategory: async (id, categoryData) => {
    const response = await api.patch(`/categories/${id}`, categoryData);
    return response.data;
  },

  /**
   * Delete a category
   *
   * @param {string} id - Category ID
   * @returns {Promise} Promise resolving to the API response
   */
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  /**
   * Change category active status
   *
   * @param {string} id - Category ID
   * @param {boolean} isActive - New active status
   * @returns {Promise} Promise resolving to the API response
   */
  changeCategoryStatus: async (id, isActive) => {
    const response = await api.patch(`/categories/${id}/status`, { isActive });
    return response.data;
  },

  /**
   * Get image URL by ID
   *
   * @param {string} imageId - Image ID
   * @returns {string} URL to the image
   */
  getImageById: (imageId) => {
    return `${api.defaults.baseURL}/uploads/${imageId}`;
  },
};

export default categoryService;
