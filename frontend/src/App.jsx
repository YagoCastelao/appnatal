import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore";
import useChatStore from "./store/chatStore";
import socketService from "./services/socket";

// Páginas
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import GlobalChatPage from "./pages/GlobalChatPage";
import UsersPage from "./pages/UsersPage";
import MessagesPage from "./pages/MessagesPage";
import DirectMessagePage from "./pages/DirectMessagePage";
import ProfilePage from "./pages/ProfilePage";

// Componentes
import LoadingSpinner from "./components/LoadingSpinner";
import Snowfall from "./components/Snowfall";
import ChristmasLights from "./components/ChristmasLights";

// Componente de rota protegida
const ProtectedRoute = ({ children }) => {
  const { user, token } = useAuthStore();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Componente de rota pública (redireciona se já logado)
const PublicRoute = ({ children }) => {
  const { user, token } = useAuthStore();

  if (token && user) {
    return <Navigate to="/chat" replace />;
  }

  return children;
};

function App() {
  const { checkAuth, user } = useAuthStore();
  const { setOnlineUsers, updateUserStatus, loadUsers, addDirectMessage } =
    useChatStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Verificar autenticação ao carregar
  useEffect(() => {
    const init = async () => {
      await checkAuth();
      setIsCheckingAuth(false);
    };
    init();
  }, []);

  // Configurar listeners globais do socket
  useEffect(() => {
    if (user) {
      const socket = socketService.connect();

      // Emitir user_connected apenas se o socket estiver conectado
      if (socket.connected) {
        socketService.userConnected(user._id);
      } else {
        socket.on("connect", () => {
          socketService.userConnected(user._id);
        });
      }

      // Listener para usuários online
      socketService.onOnlineUsers((users) => {
        console.log("Online users updated:", users.length);
        setOnlineUsers(users);
      });

      // Listener para mudança de status
      socketService.onUserStatusChange(({ user: changedUser, status }) => {
        console.log("User status changed:", changedUser.username, status);
        updateUserStatus(changedUser, status);
        loadUsers(); // Recarregar lista de usuários
      });

      // Listener para DMs recebidas
      socketService.onNewDirectMessage((message) => {
        addDirectMessage(message);
      });

      // Carregar usuários
      loadUsers();
    }

    return () => {
      if (user) {
        socketService.disconnect();
      }
    };
  }, [user?._id]);

  // Tela de carregamento
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-christmas-green to-christmas-green-dark">
        <Snowfall />
        <LoadingSpinner message="Preparando o Natal..." />
      </div>
    );
  }

  return (
    <BrowserRouter>
      {/* Efeito de neve em todas as páginas logadas */}
      {user && <Snowfall />}

      <Routes>
        {/* Rotas públicas */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Rotas protegidas */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <GlobalChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dm/:userId"
          element={
            <ProtectedRoute>
              <DirectMessagePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Redirecionar para login por padrão */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
