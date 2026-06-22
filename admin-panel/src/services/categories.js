import api from './api';

export const categoriesService = {
  list: async () => {
    const response = await api.get('/categories/');
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/categories/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  update: async (slug, data) => {
    const response = await api.patch(`/categories/${slug}/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  delete: async (slug) => {
    const response = await api.delete(`/categories/${slug}/`);
    return response.data;
  }
};
