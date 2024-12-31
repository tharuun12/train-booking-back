import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mohantrain-928y.vercel.app/',
  //baseURL: 'http://localhost:5000/',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  signup: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

export const seats = {
  getAll: () => api.get('/seats'),
  book: (seatCount: number) => api.post('/seats/book', { seatCount }),
  cancel: (seatIds: number[]) => api.post('/seats/cancel', { seatIds }),
  getUserBookings: () => api.get('/seats/user-bookings'),
};

export default api;