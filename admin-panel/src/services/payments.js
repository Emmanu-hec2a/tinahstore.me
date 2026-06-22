import api from './api';

export const paymentsService = {
  list: async (params) => {
    // MpesaTransaction is part of payments app
    const response = await api.get('/payments/transactions/', { params });
    return response.data;
  },

  query: async (checkoutRequestId) => {
    const response = await api.post('/payments/mpesa/query/', {
        checkout_request_id: checkoutRequestId
    });
    return response.data;
  },

  retriggerStk: async (orderNumber) => {
    const response = await api.post('/payments/mpesa/initiate/', {
        order_number: orderNumber
    });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/admin/dashboard/');
    return response.data;
  }
};
