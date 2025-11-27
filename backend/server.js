require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const setupSocket = require("./socket/socketHandler");

// Rotas
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const messageRoutes = require("./routes/messages");
const dmRoutes = require("./routes/directMessages");

// Conectar ao MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Configurar Socket.io - aceita conexões da rede local
const io = new Server(server, {
  cors: {
    origin: "*", // Aceita qualquer origem (para rede local)
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(
  cors({
    origin: "*", // Aceita qualquer origem (para rede local)
    credentials: true,
  })
);
app.use(express.json());

// Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/dm", dmRoutes);

// Rota de teste
app.get("/", (req, res) => {
  res.json({
    message: "🎄 API do Chat de Natal está funcionando! 🎅",
    version: "1.0.0",
  });
});

// Configurar Socket.io
setupSocket(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`
  🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄
  🎅 Servidor do Chat de Natal rodando! 🎅
  📍 Porta: ${PORT}
  🌐 Local: http://localhost:${PORT}
  📱 Rede:  http://192.168.1.23:${PORT}
  🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄
  `);
});
