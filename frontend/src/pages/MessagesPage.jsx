import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useChatStore from "../store/chatStore";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import Avatar from "../components/Avatar";
import { formatTime } from "../components/dateUtils";

const MessagesPage = () => {
  const { user } = useAuthStore();
  const { conversations, loadConversations } = useChatStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadConversations();
  }, []);

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
      <Header
        title="Mensagens"
        subtitle={`${conversations.length} conversas`}
      />

      {/* Lista de conversas */}
      <div className="flex-1 overflow-y-auto p-4 pb-20 no-bounce">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/60">
            <span className="text-6xl mb-4">💌</span>
            <p className="text-lg font-festive">Nenhuma mensagem ainda</p>
            <p className="text-sm mt-2">
              Vá em <span className="text-christmas-gold">Usuários</span> para
              iniciar uma conversa
            </p>
            <button
              onClick={() => navigate("/users")}
              className="mt-4 btn-christmas-gold"
            >
              🎅 Ver Usuários
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => (
              <button
                key={conv._id}
                onClick={() => navigate(`/dm/${conv._id}`)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 
                           hover:bg-white/10 transition-all active:scale-98 
                           border border-white/10 hover:border-christmas-gold/30"
              >
                {/* Avatar */}
                <div className="relative">
                  <Avatar
                    emoji={conv.user.avatar}
                    color={conv.user.christmasColor}
                    size="md"
                    isOnline={conv.user.isOnline}
                  />

                  {/* Badge de não lidas */}
                  {conv.unreadCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 w-5 h-5 bg-christmas-red 
                                     text-white text-xs font-bold rounded-full 
                                     flex items-center justify-center"
                    >
                      {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                    </span>
                  )}
                </div>

                {/* Info da conversa */}
                <div className="flex-1 text-left overflow-hidden">
                  <div className="flex justify-between items-center">
                    <p
                      className={`font-semibold truncate ${
                        conv.unreadCount > 0 ? "text-white" : "text-white/80"
                      }`}
                    >
                      {conv.user.username}
                    </p>
                    <span className="text-white/40 text-xs flex-shrink-0 ml-2">
                      {formatTime(conv.lastMessageDate)}
                    </span>
                  </div>
                  <p
                    className={`text-sm truncate ${
                      conv.unreadCount > 0 ? "text-white/80" : "text-white/50"
                    }`}
                  >
                    {conv.lastMessage}
                  </p>
                </div>

                {/* Seta */}
                <span className="text-white/30">›</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navegação inferior */}
      <BottomNav
        unreadDMs={conversations.reduce((acc, c) => acc + c.unreadCount, 0)}
      />
    </div>
  );
};

export default MessagesPage;
