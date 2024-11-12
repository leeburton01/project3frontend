import axios from "axios";

// Create an Axios instance with default configurations
const api = axios.create({
  baseURL: "http://localhost:5001", // Your backend URL (update if different)
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercept requests to attach the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Assuming JWT is stored in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login on unauthorized
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirects to login page
    }
    return Promise.reject(error);
  }
);

export default api;
