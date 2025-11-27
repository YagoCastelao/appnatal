import { useEffect, useState } from "react";

const Snowfall = () => {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    // Criar flocos de neve
    const flakes = [];
    const snowSymbols = ["❄", "❅", "❆", "✻", "✼", "❉"];

    for (let i = 0; i < 30; i++) {
      flakes.push({
        id: i,
        symbol: snowSymbols[Math.floor(Math.random() * snowSymbols.length)],
        left: `${Math.random() * 100}%`,
        animationDuration: `${8 + Math.random() * 12}s`,
        animationDelay: `${Math.random() * 5}s`,
        fontSize: `${0.8 + Math.random() * 1.2}rem`,
        opacity: 0.3 + Math.random() * 0.5,
      });
    }
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {snowflakes.map((flake) => (
        <span
          key={flake.id}
          className="snowflake text-white"
          style={{
            left: flake.left,
            animationDuration: flake.animationDuration,
            animationDelay: flake.animationDelay,
            fontSize: flake.fontSize,
            opacity: flake.opacity,
          }}
        >
          {flake.symbol}
        </span>
      ))}
    </div>
  );
};

export default Snowfall;
