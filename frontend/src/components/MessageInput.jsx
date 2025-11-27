import { useState, useRef, useEffect } from "react";
import socketService from "../services/socket";

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
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

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
    setMessage(e.target.value);

    // Indicador de digitação
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (e.target.value.trim()) {
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

  const addSticker = (sticker) => {
    setMessage((prev) => prev + sticker);
    setShowStickers(false);
  };

  // Fechar stickers ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showStickers && !e.target.closest(".stickers-panel")) {
        setShowStickers(false);
      }
    };
    document.addEventListener("touchstart", handleClickOutside);
    return () => document.removeEventListener("touchstart", handleClickOutside);
  }, [showStickers]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
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
