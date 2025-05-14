import api from "./api";

export const productService = {
  // Get all products with pagination and optional filters
  getAllProducts: async (page = 1, limit = 10, filters = {}) => {
    // Build the query string from filters
    let queryParams = `page=${page}&limit=${limit}`;

    // Add category filter if provided
    if (filters.category) {
      queryParams += `&category=${filters.category}`;
    }

    // Add active filter if provided
    if (filters.active !== null && filters.active !== undefined) {
      queryParams += `&active=${filters.active}`;
    }

    // Add search filter if provided
    if (filters.search) {
      queryParams += `&search=${encodeURIComponent(filters.search)}`;
    }

    // Add price range filters if provided
    if (filters.minPrice) {
      queryParams += `&minPrice=${filters.minPrice}`;
    }

    if (filters.maxPrice) {
      queryParams += `&maxPrice=${filters.maxPrice}`;
    }

    // Add company filter if provided
    if (filters.company) {
      queryParams += `&company=${filters.company}`;
    }

    // Add sort parameter if provided
    if (filters.sort) {
      queryParams += `&sort=${filters.sort}`;
    }

    const response = await api.get(`/products?${queryParams}`);
    return response.data;
  },

  // Get a single product by ID
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Create a new product
  createProduct: async (productData) => {
    const response = await api.post("/products", productData);
    return response.data;
  },

  // Update a product
  updateProduct: async (id, productData) => {
    const response = await api.patch(`/products/${id}`, productData);
    return response.data;
  },

  // Delete a product
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Change product status (active/inactive)
  changeProductStatus: async (id, isActive) => {
    const response = await api.patch(`/products/${id}/status`, { isActive });
    return response.data;
  },

  // Update product stock
  updateProductStock: async (id, stock) => {
    const response = await api.patch(`/products/${id}/stock`, { stock });
    return response.data;
  },
};

export default productService;
