// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://172.16.20.196:5000/api/astrologer', // Replace with your API URL
  timeout: 10000, // Optional: timeout after 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptors for request/response
api.interceptors.request.use(
  (config) => {
    // You can add authorization tokens here if needed
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    console.log(error,"---------------------->error message")
    return Promise.reject(error);
  }
);

export default api;
