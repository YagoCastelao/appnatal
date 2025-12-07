import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useChatStore from "../store/chatStore";
import socketService from "../services/socket";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";
import TypingIndicator from "../components/TypingIndicator";
import LoadingSpinner from "../components/LoadingSpinner";

const GlobalChatPage = () => {
  const { user } = useAuthStore();
  const {
    globalMessages,
    isLoadingMessages,
    loadGlobalMessages,
    addGlobalMessage,
    sendGlobalMessage,
    typingUsers,
    addTypingUser,
    removeTypingUser,
    onlineUsers,
  } = useChatStore();

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Carregar mensagens ao montar
  useEffect(() => {
    loadGlobalMessages();
  }, []);

  // Configurar listeners do socket
  useEffect(() => {
    const socket = socketService.connect();

    socketService.onNewGlobalMessage((message) => {
      // Só adicionar se não for do próprio usuário (evitar duplicata)
      if (message.sender._id !== user?._id) {
        addGlobalMessage(message);
      }
    });

    socketService.onUserTypingGlobal((typingUser) => {
      if (typingUser._id !== user?._id) {
        addTypingUser(typingUser);
      }
    });

    // Listener para usuários online
    socket.on("online_users", (users) => {
      useChatStore.getState().setOnlineUsers(users);
    });

    socket.on("user_status_change", ({ user: statusUser, status }) => {
      useChatStore.getState().updateUserStatus(statusUser, status);
    });

    socketService.onUserStopTypingGlobal((userId) => {
      removeTypingUser(userId);
    });

    // Listener para usuários online
    socket.on("online_users", (users) => {
      useChatStore.getState().setOnlineUsers(users);
    });

    socket.on("user_status_change", ({ user: statusUser, status }) => {
      useChatStore.getState().updateUserStatus(statusUser, status);
    });

    return () => {
      socket?.off("new_global_message");
      socket?.off("user_typing_global");
      socket?.off("user_stop_typing_global");
      socket?.off("online_users");
      socket?.off("user_status_change");
    };
  }, [user]);

  // Auto-scroll para novas mensagens
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [globalMessages]);

  const handleSendMessage = async (content) => {
    const result = await sendGlobalMessage(content, user);
    if (result.success) {
      // Adicionar localmente para resposta imediata
      // O socket vai notificar os outros
    }
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
      <Header
        title="Chat Global"
        subtitle={`${onlineUsers.length} online • 🎄 Feliz Natal!`}
        rightElement={
          <div className="flex -space-x-2">
            {onlineUsers.slice(0, 4).map((u) => (
              <div
                key={u._id}
                className="w-8 h-8 rounded-full border-2 border-christmas-green-dark flex items-center justify-center text-sm"
                style={{ backgroundColor: u.christmasColor }}
              >
                {u.avatar}
              </div>
            ))}
            {onlineUsers.length > 4 && (
              <div className="w-8 h-8 rounded-full border-2 border-christmas-green-dark bg-christmas-gold flex items-center justify-center text-xs font-bold text-christmas-green-dark">
                +{onlineUsers.length - 4}
              </div>
            )}
          </div>
        }
      />

      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto p-4 pb-36 no-bounce hide-scrollbar">
        {isLoadingMessages ? (
          <LoadingSpinner message="Carregando mensagens..." />
        ) : globalMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/60">
            <span className="text-6xl mb-4">🎄</span>
            <p className="text-lg font-festive">
              Seja o primeiro a enviar uma mensagem!
            </p>
            <p className="text-sm">Deseje Feliz Natal para todos 🎅</p>
          </div>
        ) : (
          <>
            {/* Mensagem de boas-vindas */}
            <div className="text-center mb-6 py-4">
              <div className="inline-block bg-christmas-gold/20 rounded-full px-4 py-2">
                <span className="text-christmas-gold text-sm">
                  🎄 Bem-vindo ao Chat de Natal! 🎄
                </span>
              </div>
            </div>

            {/* Lista de mensagens */}
            {globalMessages.map((message, index) => {
              const isOwn = message.sender._id === user._id;
              const showAvatar =
                index === 0 ||
                globalMessages[index - 1]?.sender._id !== message.sender._id;

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
            <TypingIndicator users={typingUsers} />

            {/* Referência para auto-scroll */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input de mensagem */}
      <div
        className="fixed bottom-16 left-0 right-0 p-3 bg-christmas-green-dark/95 backdrop-blur-lg 
                      border-t border-christmas-gold/20 safe-bottom"
      >
        <div className="max-w-lg mx-auto">
          <MessageInput
            onSend={handleSendMessage}
            userId={user._id}
            isGlobal={true}
          />
        </div>
      </div>

      {/* Navegação inferior */}
      <BottomNav />
    </div>
  );
};

export default GlobalChatPage;
