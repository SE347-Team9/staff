import axiosClient from '../axiosClient';

// Auth endpoints
export const authAPI = {
  login: (data: { username: string; password: string }) => {
    return axiosClient.post('/auth/login/', data);
  },
  
  register: (data: { username: string; email: string; password: string }) => {
    return axiosClient.post('/auth/register/', data);
  },
  
  logout: () => {
    return axiosClient.post('/auth/logout/');
  },
  
  getProfile: () => {
    return axiosClient.get('/auth/profile/');
  },
};

// Ví dụ: Đơn hàng API
export const orderAPI = {
  getAll: () => {
    return axiosClient.get('/orders/');
  },
  
  getById: (id: number) => {
    return axiosClient.get(`/orders/${id}/`);
  },
  
  create: (data: any) => {
    return axiosClient.post('/orders/', data);
  },
  
  update: (id: number, data: any) => {
    return axiosClient.put(`/orders/${id}/`, data);
  },
  
  updateStatus: (id: number, status: string) => {
    return axiosClient.patch(`/orders/${id}/status/`, { status });
  },
};
