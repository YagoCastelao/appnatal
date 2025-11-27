const LoadingSpinner = ({ message = "Carregando..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      {/* Árvore de natal animada */}
      <div className="relative animate-bounce-slow">
        <span className="text-6xl">🎄</span>
        <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-2xl animate-twinkle">
          ⭐
        </span>
      </div>

      {/* Barra de carregamento natalina */}
      <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green rounded-full animate-pulse"
          style={{ width: "60%" }}
        />
      </div>

      <p className="text-white/80 font-festive text-xl">{message}</p>

      {/* Emojis natalinos animados */}
      <div className="flex gap-2">
        {["🎅", "🦌", "⛄", "🎁"].map((emoji, i) => (
          <span
            key={i}
            className="text-2xl animate-bounce"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {emoji}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;
