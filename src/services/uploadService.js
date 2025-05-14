import api from './api';

// Upload service for managing image uploads
export const uploadService = {
  // Get all uploads with pagination
  getAllUploads: async (page = 1, limit = 10) => {
    const response = await api.get(`/uploads?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Upload a new image
  uploadImage: async (imageFile) => {
    // Create form data for uploading the image
    const formData = new FormData();
    formData.append('image', imageFile);

    // Need to use custom headers for multipart/form-data
    const response = await api.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Get image by ID (for preview)
  getImageById: async (imageId) => {
    return `${api.defaults.baseURL}/uploads/${imageId}`;
  },

  // Delete image by ID
  deleteImage: async (imageId) => {
    const response = await api.delete(`/uploads/${imageId}`);
    return response.data;
  }
};

export default uploadService;