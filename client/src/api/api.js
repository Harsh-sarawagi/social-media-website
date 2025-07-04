import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.get(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
          withCredentials: true,
        });
        return API(originalRequest);
      } catch {
        window.location.href = "/accounts/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
