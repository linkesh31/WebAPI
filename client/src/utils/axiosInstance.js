import axios from 'axios'; // Importing axios for making HTTP requests

// Create a custom axios instance with a base URL for all requests
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Base URL for API endpoints
});

// Add a request interceptor to modify requests before they're sent
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the JWT token from localStorage if it exists
    const token = localStorage.getItem('token');
    // If a token exists, add it to the Authorization header as a Bearer token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Return the modified config for the request
    return config;
  },
  (error) => {
    // If there's an error in the interceptor, reject the Promise
    return Promise.reject(error);
  }
);

// Export the configured axios instance for use in other parts of the application
export default axiosInstance;
