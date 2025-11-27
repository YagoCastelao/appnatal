const TypingIndicator = ({ users }) => {
  if (!users || users.length === 0) return null;

  const getTypingText = () => {
    if (users.length === 1) {
      return `${users[0].username || "Alguém"} está digitando`;
    } else if (users.length === 2) {
      return `${users[0].username} e ${users[1].username} estão digitando`;
    } else {
      return "Várias pessoas estão digitando";
    }
  };

  return (
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
      <span className="italic">{getTypingText()}...</span>
    </div>
  );
};

export default TypingIndicator;
