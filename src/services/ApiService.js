import axios from 'axios';

// Base URL for your API
const BASE_URL = 'https://localhost:7168/api/v1'; // Replace with your actual base URL

// Create an axios instance with custom configurations
const ApiService = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to handle errors (optional)
ApiService.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

// Function to set the Authorization header if needed
export const setAuthToken = (token) => {
  if (token) {
    ApiService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete ApiService.defaults.headers.common['Authorization'];
  }
};

// Export the ApiService instance for use in other files
export default ApiService;
