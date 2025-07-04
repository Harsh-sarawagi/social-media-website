import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import API from '../api/api';
import { jwtDecode } from 'jwt-decode';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isloading: false,
      error: null,
      isauthenticated: false,
      ischeckingauth: true,

      signup: async (form) => {
        try {
          const response = await API.post("/auth/signup", {
            name: form.name,
            userID: form.userID,
            email: form.email,
            password: form.password,
          });
          const { user } = response.data;
          set({ user, isauthenticated: true });
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.message;
          console.error("Signup failed:", errorMessage);
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isloading: false });
        }
      },

      clearError: () => set({ error: null }),

      resendcode: async (email) => {
        set({ isloading: true, error: null });
        try {
          await API.post("/auth/resendverificationcode", { email });
        } catch (error) {
          set({ isloading: false, error: error.message });
          console.log(error);
        }
      },

      verifyemail: async (email, code) => {
        set({ isloading: true, error: null });
        try {
          const response = await API.post("/auth/verify-email", { code, email });
          const data = response.data;
          set({ isloading: false, isauthenticated: true, user: data.user });
          return response.success;
        } catch (error) {
          set({ isloading: false, error: error.message });
          console.log(error);
        }
      },

      login: async (form) => {
        set({ isloading: true, error: null });
        try {
          const response = await API.post("/auth/login", {
            email: form.email,
            password: form.password,
          });

          const data = response.data;
          localStorage.setItem("ACCESS_TOKEN", data.accesstoken); // fallback
          set({ isloading: false, isauthenticated: true, user: data.user });
          return { user: data.user };
        } catch (error) {
          console.log(error.response?.data?.error);
          set({
            isloading: false,
            error: error.response?.data?.error || "Login failed",
          });
          return { error: error.response?.data?.error };
        }
      },

      checkAuth: async () => {
        set({ ischeckingauth: true });
        try {
          let accessToken = localStorage.getItem("ACCESS_TOKEN");
          const now = Math.floor(Date.now() / 1000);

          if (!accessToken || jwtDecode(accessToken).exp < now) {
            const res = await API.post("/auth/refresh-token", {}, { withCredentials: true });
            accessToken = res.data.accesstoken;
            localStorage.setItem("ACCESS_TOKEN", accessToken);
          }

          const verifyRes = await API.get("/auth/check-auth", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          });

          const user = verifyRes.data.user;
          set({ isauthenticated: true, user, ischeckingauth: false });
        } catch (error) {
          console.log(error);
          localStorage.removeItem("ACCESS_TOKEN");
          set({
            ischeckingauth: false,
            isauthenticated: false,
            user: null,
            error: "Authentication failed",
          });
        }
      },

      logout: async () => {
        localStorage.clear();
        set({ isauthenticated: false, user: null });
      },
    }),
    {
      name: 'auth-storage', // key in localStorage
      partialize: (state) => ({
        user: state.user,
        isauthenticated: state.isauthenticated,
      }),
    }
  )
);

export default useAuthStore;
