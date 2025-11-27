const Avatar = ({ emoji, color, size = "md", isOnline, className = "" }) => {
  const sizes = {
    sm: "w-8 h-8 text-lg",
    md: "w-12 h-12 text-2xl",
    lg: "w-16 h-16 text-3xl",
    xl: "w-20 h-20 text-4xl",
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`${sizes[size]} rounded-full flex items-center justify-center 
                    shadow-lg border-2 border-christmas-gold/50 
                    transition-transform hover:scale-105`}
        style={{
          background: `linear-gradient(135deg, ${color || "#c41e3a"} 0%, ${
            color ? adjustColor(color, -30) : "#8b0000"
          } 100%)`,
        }}
      >
        <span className="drop-shadow-lg">{emoji || "🎅"}</span>
      </div>

      {/* Indicador de status online */}
      {typeof isOnline === "boolean" && (
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
                      ${isOnline ? "bg-green-500" : "bg-gray-400"}`}
        />
      )}
    </div>
  );
};

// Função auxiliar para ajustar cor
const adjustColor = (color, amount) => {
  const clamp = (num) => Math.min(255, Math.max(0, num));

  let hex = color.replace("#", "");
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  r = clamp(r + amount);
  g = clamp(g + amount);
  b = clamp(b + amount);

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

export default Avatar;
