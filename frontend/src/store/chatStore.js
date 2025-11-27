import { create } from "zustand";
import api from "../services/api";
import socketService from "../services/socket";

const useChatStore = create((set, get) => ({
  // Mensagens do chat global
  globalMessages: [],
  isLoadingMessages: false,

  // Mensagens diretas
  directMessages: {},
  conversations: [],
  currentDMUser: null,

  // Usuários online
  onlineUsers: [],
  allUsers: [],

  // Usuários digitando
  typingUsers: [],
  dmTypingUser: null,

  // Carregar mensagens do chat global
  loadGlobalMessages: async () => {
    set({ isLoadingMessages: true });
    try {
      const { data } = await api.get("/messages");
      set({ globalMessages: data, isLoadingMessages: false });
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
      set({ isLoadingMessages: false });
    }
  },

  // Adicionar mensagem global
  addGlobalMessage: (message) => {
    set((state) => ({
      globalMessages: [...state.globalMessages, message],
    }));
  },

  // Enviar mensagem global
  sendGlobalMessage: async (content, user) => {
    try {
      const { data } = await api.post("/messages", { content });
      socketService.sendGlobalMessage(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  // Carregar todos os usuários
  loadUsers: async () => {
    try {
      const { data } = await api.get("/users");
      set({ allUsers: data });
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  },

  // Atualizar status de usuário
  updateUserStatus: (user, status) => {
    set((state) => ({
      allUsers: state.allUsers.map((u) =>
        u._id === user._id ? { ...u, isOnline: status === "online" } : u
      ),
      onlineUsers:
        status === "online"
          ? [...state.onlineUsers.filter((u) => u._id !== user._id), user]
          : state.onlineUsers.filter((u) => u._id !== user._id),
    }));
  },

  // Definir usuários online
  setOnlineUsers: (users) => {
    set({ onlineUsers: users });
  },

  // Carregar conversas DM
  loadConversations: async () => {
    try {
      const { data } = await api.get("/dm/conversations");
      set({ conversations: data });
    } catch (error) {
      console.error("Erro ao carregar conversas:", error);
    }
  },

  // Carregar mensagens DM com usuário específico
  loadDMMessages: async (userId) => {
    try {
      const { data } = await api.get(`/dm/${userId}`);
      set((state) => ({
        directMessages: {
          ...state.directMessages,
          [userId]: data,
        },
      }));
      return data;
    } catch (error) {
      console.error("Erro ao carregar DMs:", error);
      return [];
    }
  },

  // Enviar mensagem direta
  sendDirectMessage: async (receiverId, content) => {
    try {
      const { data } = await api.post(`/dm/${receiverId}`, { content });
      socketService.sendDirectMessage(data, receiverId);

      set((state) => ({
        directMessages: {
          ...state.directMessages,
          [receiverId]: [...(state.directMessages[receiverId] || []), data],
        },
      }));

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  // Adicionar DM recebida
  addDirectMessage: (message) => {
    const senderId = message.sender._id;
    set((state) => ({
      directMessages: {
        ...state.directMessages,
        [senderId]: [...(state.directMessages[senderId] || []), message],
      },
    }));
  },

  // Definir usuário atual do DM
  setCurrentDMUser: (user) => {
    set({ currentDMUser: user });
  },

  // Adicionar usuário digitando
  addTypingUser: (user) => {
    set((state) => ({
      typingUsers: state.typingUsers.find((u) => u._id === user._id)
        ? state.typingUsers
        : [...state.typingUsers, user],
    }));
  },

  // Remover usuário digitando
  removeTypingUser: (userId) => {
    set((state) => ({
      typingUsers: state.typingUsers.filter((u) => u._id !== userId),
    }));
  },

  // DM typing
  setDMTypingUser: (userId) => {
    set({ dmTypingUser: userId });
  },

  clearDMTypingUser: () => {
    set({ dmTypingUser: null });
  },

  // Limpar store
  clearChat: () => {
    set({
      globalMessages: [],
      directMessages: {},
      conversations: [],
      currentDMUser: null,
      onlineUsers: [],
      typingUsers: [],
      dmTypingUser: null,
    });
  },
}));

export default useChatStore;
