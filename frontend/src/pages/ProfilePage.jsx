import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useChatStore from "../store/chatStore";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import Avatar from "../components/Avatar";
import api from "../services/api";

const christmasAvatars = [
  "🎅",
  "🤶",
  "🦌",
  "⛄",
  "🎄",
  "🎁",
  "👼",
  "❄️",
  "🔔",
  "⭐",
  "🕯️",
  "🧦",
];

const ProfilePage = () => {
  const { user, logout, updateUser } = useAuthStore();
  const { clearChat } = useChatStore();
  const navigate = useNavigate();
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleLogout = async () => {
    await logout();
    clearChat();
    navigate("/login");
  };

  const handleAvatarChange = async (newAvatar) => {
    setIsUpdating(true);
    try {
      const { data } = await api.put("/users/avatar", { avatar: newAvatar });
      updateUser({ avatar: data.avatar });
      setShowAvatarPicker(false);
    } catch (error) {
      console.error("Erro ao atualizar avatar:", error);
    }
    setIsUpdating(false);
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div
      className="flex flex-col bg-gradient-to-b from-christmas-green to-christmas-green-dark"
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
    >
      {/* Header */}
      <Header title="Meu Perfil" />

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto p-4 pb-20 no-bounce">
        {/* Card do perfil */}
        <div className="card-christmas text-center mb-6">
          {/* Avatar */}
          <div className="relative inline-block mb-4">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-5xl 
                         shadow-xl border-4 border-christmas-gold cursor-pointer
                         hover:scale-105 transition-transform"
              style={{
                background: `linear-gradient(135deg, ${user.christmasColor} 0%, #0a3d22 100%)`,
              }}
              onClick={() => setShowAvatarPicker(true)}
            >
              {user.avatar}
            </div>
            <button
              onClick={() => setShowAvatarPicker(true)}
              className="absolute bottom-0 right-0 w-8 h-8 bg-christmas-gold rounded-full 
                         flex items-center justify-center text-christmas-green-dark 
                         shadow-lg hover:scale-110 transition-transform"
            >
              ✏️
            </button>
          </div>

          {/* Info */}
          <h2 className="text-white text-xl font-bold mb-1">{user.username}</h2>
          <p className="text-white/60 text-sm mb-4">{user.email}</p>

          {/* Cor natalina */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-white/60 text-sm">Sua cor natalina:</span>
            <div
              className="w-6 h-6 rounded-full border-2 border-white/30"
              style={{ backgroundColor: user.christmasColor }}
            />
          </div>

          {/* Status */}
          <div className="inline-flex items-center gap-2 bg-green-500/20 rounded-full px-4 py-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm">Online</span>
          </div>
        </div>

        {/* Seletor de Avatar */}
        {showAvatarPicker && (
          <div className="card-christmas mb-6">
            <h3 className="text-white font-semibold mb-3 text-center">
              Escolha seu avatar natalino 🎄
            </h3>
            <div className="grid grid-cols-6 gap-2">
              {christmasAvatars.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => handleAvatarChange(avatar)}
                  disabled={isUpdating}
                  className={`text-3xl p-2 rounded-xl transition-all
                             ${
                               user.avatar === avatar
                                 ? "bg-christmas-gold/30 scale-110"
                                 : "hover:bg-white/10 hover:scale-105"
                             }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAvatarPicker(false)}
              className="w-full mt-3 text-white/60 text-sm py-2 hover:text-white"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Informações do chat */}
        <div className="card-christmas mb-6">
          <h3 className="text-white font-semibold mb-3">
            🎄 Informações do Chat
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Limite de usuários</span>
              <span className="text-white">8 pessoas</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Sessão expira em</span>
              <span className="text-white">40 dias</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Evento</span>
              <span className="text-christmas-gold">🎄 Natal 2024</span>
            </div>
          </div>
        </div>

        {/* Botão de logout */}
        <button
          onClick={handleLogout}
          className="w-full btn-christmas bg-christmas-red-dark flex items-center justify-center gap-2"
        >
          <span>👋</span>
          <span>Sair do Chat</span>
        </button>

        {/* Mensagem de natal */}
        <div className="text-center mt-8">
          <p className="text-christmas-gold font-festive text-lg">
            ✨ Feliz Natal e Boas Festas! ✨
          </p>
          <p className="text-white/40 text-xs mt-2">
            Chat de Natal 2024 • v1.0.0
          </p>
        </div>
      </div>

      {/* Navegação inferior */}
      <BottomNav />
    </div>
  );
};

export default ProfilePage;
