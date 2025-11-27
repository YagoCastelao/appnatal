import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../services/api";
import socketService from "../services/socket";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      // Login
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post("/auth/login", { email, password });

          localStorage.setItem("natal-chat-token", data.token);

          // Conectar socket e notificar
          socketService.connect();
          socketService.userConnected(data._id);

          set({
            user: data,
            token: data.token,
            isLoading: false,
          });

          return { success: true, data };
        } catch (error) {
          const message =
            error.response?.data?.message || "Erro ao fazer login";
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      // Registro
      register: async (username, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post("/auth/register", {
            username,
            email,
            password,
          });

          localStorage.setItem("natal-chat-token", data.token);

          // Conectar socket e notificar
          socketService.connect();
          socketService.userConnected(data._id);

          set({
            user: data,
            token: data.token,
            isLoading: false,
          });

          return { success: true, data };
        } catch (error) {
          const message = error.response?.data?.message || "Erro ao registrar";
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      // Logout
      logout: async () => {
        try {
          await api.post("/auth/logout");
        } catch (error) {
          console.error("Erro ao fazer logout:", error);
        }

        socketService.disconnect();
        localStorage.removeItem("natal-chat-token");

        set({ user: null, token: null });
      },

      // Verificar autenticação ao carregar
      checkAuth: async () => {
        const token = localStorage.getItem("natal-chat-token");

        if (!token) {
          set({ user: null, token: null });
          return false;
        }

        try {
          const { data } = await api.get("/auth/me");

          socketService.connect();
          socketService.userConnected(data._id);

          set({ user: data, token });
          return true;
        } catch (error) {
          localStorage.removeItem("natal-chat-token");
          set({ user: null, token: null });
          return false;
        }
      },

      // Atualizar usuário
      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } });
      },

      // Limpar erro
      clearError: () => set({ error: null }),
    }),
    {
      name: "natal-chat-auth",
      partialize: (state) => ({ token: state.token }),
    }
  )
);

export default useAuthStore;
