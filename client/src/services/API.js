import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Your backend URL
  timeout: 5000, // Timeout for requests
});

// Attach Authorization Token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle Responses and Errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default API;
