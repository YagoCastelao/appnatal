import axios from "axios";

// Detecta se está acessando via localhost ou IP da rede
const getBaseUrl = () => {
  const hostname = window.location.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:5000/api";
  }
  return `http://${hostname}:5000/api`;
};

const API_URL = import.meta.env.VITE_API_URL || getBaseUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("natal-chat-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("natal-chat-token");
      localStorage.removeItem("natal-chat-user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
