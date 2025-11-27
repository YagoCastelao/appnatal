const Header = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightElement,
}) => {
  return (
    <header
      className="sticky top-0 z-30 bg-christmas-green-dark/95 backdrop-blur-lg 
                       border-b border-christmas-gold/20 safe-top"
    >
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
        {/* Lado esquerdo */}
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center
                        hover:bg-white/20 transition-colors"
            >
              <span className="text-white text-xl">←</span>
            </button>
          )}

          <div>
            <h1 className="text-white font-christmas text-xl font-bold flex items-center gap-2">
              {!showBack && <span>🎄</span>}
              {title}
            </h1>
            {subtitle && <p className="text-white/60 text-xs">{subtitle}</p>}
          </div>
        </div>

        {/* Lado direito */}
        {rightElement && <div>{rightElement}</div>}
      </div>
    </header>
  );
};

export default Header;
