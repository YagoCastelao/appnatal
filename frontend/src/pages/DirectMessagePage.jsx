import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useChatStore from "../store/chatStore";
import socketService from "../services/socket";
import api from "../services/api";
import Header from "../components/Header";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";
import Avatar from "../components/Avatar";
import LoadingSpinner from "../components/LoadingSpinner";

const DirectMessagePage = () => {
  const { userId } = useParams();
  const { user } = useAuthStore();
  const {
    directMessages,
    loadDMMessages,
    sendDirectMessage,
    addDirectMessage,
    dmTypingUser,
    setDMTypingUser,
    clearDMTypingUser,
  } = useChatStore();

  const [otherUser, setOtherUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const messages = directMessages[userId] || [];

  // Carregar dados do usuário e mensagens
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Carregar dados do outro usuário
        const { data } = await api.get(`/users/${userId}`);
        setOtherUser(data);

        // Carregar mensagens
        await loadDMMessages(userId);
      } catch (error) {
        console.error("Erro ao carregar conversa:", error);
        navigate("/users");
      }
      setIsLoading(false);
    };

    loadData();
  }, [userId]);

  // Configurar listeners do socket
  useEffect(() => {
    socketService.onNewDirectMessage((message) => {
      if (message.sender._id === userId) {
        addDirectMessage(message);
      }
    });

    socketService.onUserTypingDM((typingUserId) => {
      if (typingUserId === userId) {
        setDMTypingUser(typingUserId);
      }
    });

    socketService.onUserStopTypingDM((typingUserId) => {
      if (typingUserId === userId) {
        clearDMTypingUser();
      }
    });

    return () => {
      clearDMTypingUser();
    };
  }, [userId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content) => {
    await sendDirectMessage(userId, content);
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-b from-christmas-green to-christmas-green-dark items-center justify-center">
        <LoadingSpinner message="Carregando conversa..." />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col bg-gradient-to-b from-christmas-green to-christmas-green-dark"
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
    >
      {/* Header com info do usuário */}
      <Header
        title={otherUser?.username || "Conversa"}
        subtitle={otherUser?.isOnline ? "🟢 Online" : "⚪ Offline"}
        showBack
        onBack={() => navigate("/users")}
        rightElement={
          <Avatar
            emoji={otherUser?.avatar}
            color={otherUser?.christmasColor}
            size="sm"
            isOnline={otherUser?.isOnline}
          />
        }
      />

      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto p-4 no-bounce">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/60">
            <div className="text-6xl mb-4">{otherUser?.avatar || "🎁"}</div>
            <p className="text-lg font-medium">{otherUser?.username}</p>
            <p className="text-sm mt-2">Comece uma conversa natalina!</p>
            <p className="text-xs mt-1">Deseje Feliz Natal 🎄</p>
          </div>
        ) : (
          <>
            {/* Info da conversa */}
            <div className="text-center mb-6 py-4">
              <div className="inline-flex flex-col items-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2 shadow-lg border-2 border-christmas-gold"
                  style={{
                    background: `linear-gradient(135deg, ${
                      otherUser?.christmasColor || "#c41e3a"
                    } 0%, #0a3d22 100%)`,
                  }}
                >
                  {otherUser?.avatar || "🎅"}
                </div>
                <p className="text-white font-semibold">
                  {otherUser?.username}
                </p>
                <p className="text-white/40 text-xs">Mensagens privadas</p>
              </div>
            </div>

            {/* Lista de mensagens */}
            {messages.map((message, index) => {
              const isOwn = message.sender._id === user._id;
              const showAvatar =
                index === 0 ||
                messages[index - 1]?.sender._id !== message.sender._id;

              return (
                <MessageBubble
                  key={message._id}
                  message={message}
                  isOwn={isOwn}
                  showAvatar={showAvatar}
                />
              );
            })}

            {/* Indicador de digitação */}
            {dmTypingUser === userId && (
              <div className="flex items-center gap-2 px-4 py-2 text-white/60 text-sm">
                <div className="flex gap-1">
                  <span
                    className="w-2 h-2 bg-christmas-gold rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-christmas-gold rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-christmas-gold rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
                <span className="italic">
                  {otherUser?.username} está digitando...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input de mensagem */}
      <div className="p-4 bg-christmas-green-dark/95 backdrop-blur-lg border-t border-christmas-gold/20 safe-bottom">
        <div className="max-w-lg mx-auto">
          <MessageInput
            onSend={handleSendMessage}
            userId={user._id}
            isGlobal={false}
            receiverId={userId}
          />
        </div>
      </div>
    </div>
  );
};

export default DirectMessagePage;
