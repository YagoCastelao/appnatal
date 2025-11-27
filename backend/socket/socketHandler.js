const User = require("../models/User");

const setupSocket = (io) => {
  // Armazenar conexões de usuários
  const connectedUsers = new Map();

  io.on("connection", (socket) => {
    console.log("🎄 Novo usuário conectado:", socket.id);

    // Usuário entra no chat
    socket.on("user_connected", async (userId) => {
      try {
        connectedUsers.set(userId, socket.id);

        await User.findByIdAndUpdate(userId, {
          isOnline: true,
          lastSeen: new Date(),
        });

        // Notificar todos que usuário entrou
        const user = await User.findById(userId).select("-password");
        io.emit("user_status_change", { user, status: "online" });

        // Enviar lista de usuários online
        const onlineUsers = await User.find({ isOnline: true }).select(
          "-password"
        );
        io.emit("online_users", onlineUsers);

        console.log(`🎅 ${user.username} entrou no chat de Natal!`);
      } catch (error) {
        console.error("Erro ao conectar usuário:", error);
      }
    });

    // Mensagem no chat global
    socket.on("global_message", async (message) => {
      io.emit("new_global_message", message);
    });

    // Mensagem direta
    socket.on("direct_message", async (data) => {
      const { message, receiverId } = data;

      // Enviar para o destinatário se estiver online
      const receiverSocketId = connectedUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("new_direct_message", message);
      }

      // Enviar confirmação para o remetente
      socket.emit("dm_sent", message);
    });

    // Usuário está digitando no chat global
    socket.on("typing_global", async (user) => {
      socket.broadcast.emit("user_typing_global", user);
    });

    // Usuário parou de digitar no chat global
    socket.on("stop_typing_global", async (userId) => {
      socket.broadcast.emit("user_stop_typing_global", userId);
    });

    // Usuário está digitando em DM
    socket.on("typing_dm", async ({ userId, receiverId }) => {
      const receiverSocketId = connectedUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user_typing_dm", userId);
      }
    });

    // Usuário parou de digitar em DM
    socket.on("stop_typing_dm", async ({ userId, receiverId }) => {
      const receiverSocketId = connectedUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user_stop_typing_dm", userId);
      }
    });

    // Desconexão
    socket.on("disconnect", async () => {
      let disconnectedUserId = null;

      // Encontrar o usuário que desconectou
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          connectedUsers.delete(userId);
          break;
        }
      }

      if (disconnectedUserId) {
        try {
          await User.findByIdAndUpdate(disconnectedUserId, {
            isOnline: false,
            lastSeen: new Date(),
          });

          const user = await User.findById(disconnectedUserId).select(
            "-password"
          );
          io.emit("user_status_change", { user, status: "offline" });

          // Atualizar lista de usuários online
          const onlineUsers = await User.find({ isOnline: true }).select(
            "-password"
          );
          io.emit("online_users", onlineUsers);

          console.log(
            `❄️ ${user?.username || "Usuário"} saiu do chat de Natal`
          );
        } catch (error) {
          console.error("Erro ao desconectar usuário:", error);
        }
      }
    });
  });
};

module.exports = setupSocket;
