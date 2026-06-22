import api from './api';

export const productsService = {
  list: async (params) => {
    const response = await api.get('/products/', { params });
    return response.data;
  },

  get: async (slug) => {
    const response = await api.get(`/products/${slug}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/products/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  update: async (slug, data) => {
    const response = await api.patch(`/products/${slug}/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  delete: async (slug) => {
    const response = await api.delete(`/products/${slug}/`);
    return response.data;
  },

  toggleActive: async (slug, isActive) => {
    const response = await api.patch(`/products/${slug}/`, { is_active: isActive });
    return response.data;
  }
};
