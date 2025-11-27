import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useChatStore from "../store/chatStore";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import UserList from "../components/UserList";
import LoadingSpinner from "../components/LoadingSpinner";

const UsersPage = () => {
  const { user } = useAuthStore();
  const { allUsers, loadUsers, onlineUsers } = useChatStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const handleUserClick = (selectedUser) => {
    navigate(`/dm/${selectedUser._id}`);
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  const onlineCount = allUsers.filter((u) => u.isOnline).length;

  return (
    <div
      className="flex flex-col bg-gradient-to-b from-christmas-green to-christmas-green-dark"
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
    >
      {/* Header */}
      <Header
        title="Participantes"
        subtitle={`${onlineCount} online de ${allUsers.length} usuários`}
      />

      {/* Lista de usuários */}
      <div className="flex-1 overflow-y-auto p-4 pb-20 no-bounce">
        {/* Info sobre limite */}
        <div className="bg-christmas-gold/10 rounded-xl p-3 mb-4 border border-christmas-gold/30">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎅</span>
            <div>
              <p className="text-white text-sm font-medium">
                Chat de Natal Exclusivo
              </p>
              <p className="text-white/60 text-xs">
                Máximo de 8 participantes • {8 - allUsers.length} vagas
                restantes
              </p>
            </div>
          </div>
        </div>

        {/* Meu perfil */}
        <div className="mb-4">
          <p className="text-white/60 text-xs uppercase tracking-wide mb-2 px-2">
            Você
          </p>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-christmas-gold/20 border border-christmas-gold/30">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg border-2 border-christmas-gold"
              style={{
                background: `linear-gradient(135deg, ${user.christmasColor} 0%, #0a3d22 100%)`,
              }}
            >
              {user.avatar}
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold">{user.username}</p>
              <p className="text-green-400 text-xs">🟢 Online (você)</p>
            </div>
          </div>
        </div>

        {/* Outros usuários */}
        <div>
          <p className="text-white/60 text-xs uppercase tracking-wide mb-2 px-2">
            Outros participantes ({allUsers.length - 1})
          </p>

          {allUsers.length <= 1 ? (
            <div className="text-center py-8">
              <span className="text-5xl mb-3 block">🦌</span>
              <p className="text-white/60">Aguardando mais pessoas...</p>
              <p className="text-white/40 text-sm mt-1">
                Convide seus amigos para o chat!
              </p>
            </div>
          ) : (
            <UserList
              users={allUsers}
              currentUserId={user._id}
              onUserClick={handleUserClick}
            />
          )}
        </div>

        {/* Legenda */}
        <div className="mt-6 flex justify-center gap-6 text-xs text-white/50">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Online</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full" />
            <span>Offline</span>
          </div>
        </div>
      </div>

      {/* Navegação inferior */}
      <BottomNav />
    </div>
  );
};

export default UsersPage;
