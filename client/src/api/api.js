import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',  // Ensure Content-Type is set
      'Accept': 'application/json',       // Ensure server knows that you expect JSON responses
    },
    withCredentials:true
});

// Request Interceptor (optional: to attach headers or log)
API.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor to handle 401 and try refreshing token
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.get("/api/auth/refresh", { withCredentials: true }); // refresh token endpoint
        return API(originalRequest); // retry original request
      } catch (refreshError) {
        // Refresh failed → logout user
        window.location.href = "/accounts/login"; // or dispatch logout
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
