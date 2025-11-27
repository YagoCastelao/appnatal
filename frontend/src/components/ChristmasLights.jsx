const ChristmasLights = () => {
  const colors = [
    "#ff0000",
    "#00ff00",
    "#ffd700",
    "#ff6b6b",
    "#00d4ff",
    "#ff00ff",
  ];

  return (
    <div className="fixed top-0 left-0 right-0 flex justify-center gap-4 py-2 z-40 overflow-hidden">
      <div className="flex gap-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full animate-twinkle"
            style={{
              backgroundColor: colors[i % colors.length],
              animationDelay: `${i * 0.2}s`,
              boxShadow: `0 0 10px ${colors[i % colors.length]}, 0 0 20px ${
                colors[i % colors.length]
              }`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ChristmasLights;
