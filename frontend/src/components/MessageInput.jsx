import { useState, useRef, useEffect } from "react";
import socketService from "../services/socket";
import useChatStore from "../store/chatStore";

const christmasStickers = [
  "🎄",
  "🎅",
  "🤶",
  "🦌",
  "⛄",
  "🎁",
  "🔔",
  "⭐",
  "❄️",
  "🕯️",
  "🧦",
  "🍪",
  "🥛",
  "👼",
  "🎀",
  "✨",
];

const MessageInput = ({
  onSend,
  userId,
  isGlobal = true,
  receiverId = null,
}) => {
  const [message, setMessage] = useState("");
  const [showStickers, setShowStickers] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { allUsers } = useChatStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
      setShowStickers(false);

      // Blur do input para fechar teclado em mobile
      inputRef.current?.blur();

      // Parar indicador de digitação
      if (isGlobal) {
        socketService.stopTypingGlobal(userId);
      } else if (receiverId) {
        socketService.stopTypingDM(userId, receiverId);
      }
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    const newCursorPosition = e.target.selectionStart;
    setMessage(newValue);
    setCursorPosition(newCursorPosition);

    // Detectar menção (@)
    const textBeforeCursor = newValue.slice(0, newCursorPosition);
    const lastAtSymbol = textBeforeCursor.lastIndexOf("@");

    if (lastAtSymbol !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtSymbol + 1);
      // Só mostrar se não houver espaço depois do @
      if (!textAfterAt.includes(" ")) {
        setMentionSearch(textAfterAt.toLowerCase());
        setShowMentions(true);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }

    // Indicador de digitação
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (newValue.trim()) {
      if (isGlobal) {
        socketService.typingGlobal({ _id: userId });
      } else if (receiverId) {
        socketService.typingDM(userId, receiverId);
      }

      typingTimeoutRef.current = setTimeout(() => {
        if (isGlobal) {
          socketService.stopTypingGlobal(userId);
        } else if (receiverId) {
          socketService.stopTypingDM(userId, receiverId);
        }
      }, 2000);
    }
  };

  const handleMentionSelect = (username) => {
    const textBeforeCursor = message.slice(0, cursorPosition);
    const lastAtSymbol = textBeforeCursor.lastIndexOf("@");
    const textAfterCursor = message.slice(cursorPosition);

    const newMessage =
      message.slice(0, lastAtSymbol) + `@${username} ` + textAfterCursor;

    setMessage(newMessage);
    setShowMentions(false);
    inputRef.current?.focus();
  };

  // Filtrar usuários para menção
  const filteredUsers = showMentions
    ? allUsers
        .filter(
          (user) =>
            user._id !== userId &&
            user.username.toLowerCase().includes(mentionSearch)
        )
        .slice(0, 5)
    : [];

  const addSticker = (sticker) => {
    setMessage((prev) => prev + sticker);
    setShowStickers(false);
  };

  // Fechar stickers e menções ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showStickers && !e.target.closest(".stickers-panel")) {
        setShowStickers(false);
      }
      if (showMentions && !e.target.closest(".mentions-panel")) {
        setShowMentions(false);
      }
    };
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStickers, showMentions]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      {/* Painel de menções */}
      {showMentions && filteredUsers.length > 0 && (
        <div className="mentions-panel absolute bottom-full left-0 right-0 mb-2 bg-white/95 rounded-2xl shadow-lg z-50 max-h-48 overflow-y-auto">
          <p className="text-christmas-green text-xs font-semibold px-3 pt-2 pb-1">
            @ Mencionar usuário
          </p>
          <div className="divide-y divide-christmas-gold/20">
            {filteredUsers.map((user) => (
              <button
                key={user._id}
                type="button"
                onClick={() => handleMentionSelect(user.username)}
                className="w-full px-3 py-2.5 flex items-center gap-2 hover:bg-christmas-gold/10 active:bg-christmas-gold/20 transition-colors text-left touch-manipulation"
              >
                <span className="text-xl">{user.avatar || "🎅"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-christmas-green font-medium text-sm truncate">
                    {user.username}
                  </p>
                  {user.isOnline && (
                    <p className="text-christmas-gold text-xs">Online</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Painel de stickers natalinos */}
      {showStickers && (
        <div className="stickers-panel absolute bottom-full left-0 right-0 mb-2 p-3 bg-white/95 rounded-2xl shadow-lg z-50">
          <p className="text-christmas-green text-xs font-semibold mb-2">
            🎄 Stickers de Natal
          </p>
          <div className="grid grid-cols-8 gap-1">
            {christmasStickers.map((sticker, index) => (
              <button
                key={index}
                type="button"
                onClick={() => addSticker(sticker)}
                className="text-2xl active:scale-110 transition-transform p-2 rounded-lg active:bg-christmas-gold/20 touch-manipulation"
              >
                {sticker}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input de mensagem */}
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        {/* Botão de stickers */}
        <button
          type="button"
          onClick={() => setShowStickers(!showStickers)}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0
                     transition-all active:scale-95 touch-manipulation
                     ${showStickers ? "bg-christmas-gold" : "bg-white/20"}`}
        >
          🎁
        </button>

        {/* Campo de texto */}
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={handleInputChange}
          placeholder="Mensagem natalina..."
          className="input-christmas flex-1 text-base py-2.5"
          maxLength={500}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />

        {/* Botão de enviar */}
        <button
          type="submit"
          disabled={!message.trim()}
          className={`w-11 h-11 rounded-full flex items-center justify-center text-lg flex-shrink-0
                     transition-all active:scale-95 touch-manipulation
                     ${
                       message.trim()
                         ? "bg-christmas-red shadow-lg"
                         : "bg-white/20 opacity-50"
                     }`}
        >
          🎅
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
