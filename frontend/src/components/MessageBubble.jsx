import { formatTime } from "./dateUtils";

const MessageBubble = ({ message, isOwn, showAvatar = true }) => {
  return (
    <div
      className={`flex gap-2 mb-3 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      {showAvatar && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-lg shadow-md"
          style={{
            background: `linear-gradient(135deg, ${
              message.sender.christmasColor || "#c41e3a"
            } 0%, #0a3d22 100%)`,
          }}
        >
          {message.sender.avatar || "🎅"}
        </div>
      )}

      {/* Mensagem */}
      <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
        {/* Nome do usuário (se não for própria) */}
        {!isOwn && showAvatar && (
          <span
            className="text-xs font-semibold mb-1 px-2"
            style={{ color: message.sender.christmasColor || "#ffd700" }}
          >
            {message.sender.username}
          </span>
        )}

        {/* Balão da mensagem */}
        <div
          className={`message-bubble ${
            isOwn ? "message-bubble-sent" : "message-bubble-received"
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>

        {/* Horário */}
        <span className="text-[10px] text-white/50 mt-1 px-2">
          {formatTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
