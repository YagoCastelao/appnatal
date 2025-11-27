import { NavLink } from "react-router-dom";

const BottomNav = ({ unreadDMs = 0 }) => {
  const navItems = [
    { to: "/chat", icon: "💬", label: "Chat", activeIcon: "🎄" },
    { to: "/users", icon: "👥", label: "Pessoas", activeIcon: "🎅" },
    {
      to: "/messages",
      icon: "✉️",
      label: "DMs",
      activeIcon: "🎁",
      badge: unreadDMs,
    },
    { to: "/profile", icon: "⚙️", label: "Perfil", activeIcon: "⭐" },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-christmas-green-dark/95 backdrop-blur-lg 
                    border-t border-christmas-gold/20 z-40"
      style={{ paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}
    >
      <div className="flex justify-around items-center h-14 max-w-lg mx-auto px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all relative
               active:scale-95 touch-manipulation
               ${isActive ? "text-christmas-gold" : "text-white/60"}`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`text-xl mb-0.5 ${
                    isActive ? "scale-110" : ""
                  } transition-transform`}
                >
                  {isActive ? item.activeIcon : item.icon}
                </span>
                <span className="text-[9px] font-medium">{item.label}</span>

                {/* Badge de notificação */}
                {item.badge > 0 && (
                  <span
                    className="absolute -top-0.5 right-0 min-w-[18px] h-[18px] bg-christmas-red 
                                   text-white text-[10px] font-bold rounded-full 
                                   flex items-center justify-center px-1 animate-pulse"
                  >
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
