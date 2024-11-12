import axios from "axios";

console.log("Backend Base URL:", import.meta.env.VITE_BACKEND_URL);

const api = axios.create({
  baseURL:
    import.meta.env.VITE_BACKEND_URL ||
    "https://project3backend-8r7s.onrender.com",
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
