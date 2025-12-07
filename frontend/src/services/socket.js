import { io } from "socket.io-client";

// Detecta se está acessando via localhost ou IP da rede
const getSocketUrl = () => {
  // Em produção, usar a variável de ambiente
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  
  const hostname = window.location.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:5000";
  }
  return `http://${hostname}:5000`;
};

const SOCKET_URL = getSocketUrl();

console.log('🎄 Socket URL:', SOCKET_URL);

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ["websocket", "polling"],
        autoConnect: true,
      });

      this.socket.on("connect", () => {
        console.log("🎄 Conectado ao servidor de chat!");
      });

      this.socket.on("disconnect", () => {
        console.log("❄️ Desconectado do servidor");
      });

      this.socket.on("connect_error", (error) => {
        console.error("Erro de conexão:", error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Emitir que usuário conectou
  userConnected(userId) {
    if (this.socket) {
      console.log('🎅 Emitting user_connected:', userId);
      this.socket.emit("user_connected", userId);
    }
  }

  // Enviar mensagem global
  sendGlobalMessage(message) {
    if (this.socket) {
      this.socket.emit("global_message", message);
    }
  }

  // Enviar mensagem direta
  sendDirectMessage(message, receiverId) {
    if (this.socket) {
      this.socket.emit("direct_message", { message, receiverId });
    }
  }

  // Indicador de digitação no chat global
  typingGlobal(user) {
    if (this.socket) {
      this.socket.emit("typing_global", user);
    }
  }

  stopTypingGlobal(userId) {
    if (this.socket) {
      this.socket.emit("stop_typing_global", userId);
    }
  }

  // Indicador de digitação em DM
  typingDM(userId, receiverId) {
    if (this.socket) {
      this.socket.emit("typing_dm", { userId, receiverId });
    }
  }

  stopTypingDM(userId, receiverId) {
    if (this.socket) {
      this.socket.emit("stop_typing_dm", { userId, receiverId });
    }
  }

  // Listeners
  onNewGlobalMessage(callback) {
    if (this.socket) {
      this.socket.on("new_global_message", callback);
    }
  }

  onNewDirectMessage(callback) {
    if (this.socket) {
      this.socket.on("new_direct_message", callback);
    }
  }

  onDMSent(callback) {
    if (this.socket) {
      this.socket.on("dm_sent", callback);
    }
  }

  onUserStatusChange(callback) {
    if (this.socket) {
      this.socket.on("user_status_change", callback);
    }
  }

  onOnlineUsers(callback) {
    if (this.socket) {
      this.socket.on("online_users", (users) => {
        console.log('📊 Received online_users:', users.length, 'users');
        callback(users);
      });
    }
  }

  onUserTypingGlobal(callback) {
    if (this.socket) {
      this.socket.on("user_typing_global", callback);
    }
  }

  onUserStopTypingGlobal(callback) {
    if (this.socket) {
      this.socket.on("user_stop_typing_global", callback);
    }
  }

  onUserTypingDM(callback) {
    if (this.socket) {
      this.socket.on("user_typing_dm", callback);
    }
  }

  onUserStopTypingDM(callback) {
    if (this.socket) {
      this.socket.on("user_stop_typing_dm", callback);
    }
  }

  // Remover listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

export default new SocketService();
