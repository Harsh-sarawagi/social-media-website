import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import API from '../api/api';

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
          const response = await API.post("/auth/signup", form);
          set({ user: response.data.user, isauthenticated: true });
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.message;
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
          set({ error: error.message });
        } finally {
          set({ isloading: false });
        }
      },

      verifyemail: async (email, code) => {
        set({ isloading: true, error: null });
        try {
          const response = await API.post("/auth/verify-email", { email, code });
          set({ isauthenticated: true, user: response.data.user });
          return true;
        } catch (error) {
          set({ error: error.message });
          return false;
        } finally {
          set({ isloading: false });
        }
      },

      login: async (form) => {
        set({ isloading: true, error: null });
        try {
          const res = await API.post("/auth/login", form); // sets cookies
          set({ user: res.data.user, isauthenticated: true });
          return { user: res.data.user };
        } catch (error) {
          const errMsg = error.response?.data?.error || "Login failed";
          set({ error: errMsg });
          return { error: errMsg };
        } finally {
          set({ isloading: false });
        }
      },

      checkAuth: async () => {
        set({ ischeckingauth: true });
        try {
          const res = await API.get("/auth/check-auth"); // no headers, only cookie
          set({ isauthenticated: true, user: res.data.user, ischeckingauth: false });
        } catch (error) {
          set({
            isauthenticated: false,
            user: null,
            error: "Authentication failed",
            ischeckingauth: false,
          });
        }
      },

      logout: async () => {
        try {
          await API.post("/auth/logout"); // backend clears cookies
        } catch (err) {
          console.error("Logout error:", err.message);
        } finally {
          set({ isauthenticated: false, user: null });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isauthenticated: state.isauthenticated,
      }),
    }
  )
);

export default useAuthStore;
