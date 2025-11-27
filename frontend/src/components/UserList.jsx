import Avatar from "./Avatar";

const UserList = ({ users, currentUserId, onUserClick }) => {
  const otherUsers = users.filter((u) => u._id !== currentUserId);

  if (otherUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-white/60">
        <span className="text-4xl mb-2">🦌</span>
        <p className="text-sm">Nenhum outro usuário ainda</p>
        <p className="text-xs">Aguardando mais pessoas no chat...</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {otherUsers.map((user) => (
        <button
          key={user._id}
          onClick={() => onUserClick(user)}
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 
                     hover:bg-white/10 transition-all active:scale-98 
                     border border-white/10 hover:border-christmas-gold/30"
        >
          <Avatar
            emoji={user.avatar}
            color={user.christmasColor}
            size="md"
            isOnline={user.isOnline}
          />

          <div className="flex-1 text-left">
            <p className="text-white font-semibold text-sm truncate">
              {user.username}
            </p>
            <p
              className={`text-xs ${
                user.isOnline ? "text-green-400" : "text-white/40"
              }`}
            >
              {user.isOnline ? "🟢 Online" : "⚪ Offline"}
            </p>
          </div>

          {/* Ícone de mensagem */}
          <div className="text-christmas-gold/60 hover:text-christmas-gold transition-colors">
            💬
          </div>
        </button>
      ))}
    </div>
  );
};

export default UserList;
