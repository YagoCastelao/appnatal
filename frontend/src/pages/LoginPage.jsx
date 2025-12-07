import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Snowfall from "../components/Snowfall";
import LoadingSpinner from "../components/LoadingSpinner";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate("/chat");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-b from-christmas-green to-christmas-green-dark">
      <Snowfall />

      {/* Decoração de fundo */}
      <div className="absolute inset-0 bg-snow-pattern opacity-30" />

      {/* Logo / Título */}
      <div className="text-center mb-8 z-10">
        <div className="text-8xl mb-4 animate-bounce-slow">🎄</div>
        <h1 className="font-christmas text-4xl text-white text-shadow-christmas mb-2">
          Chat de Natal
        </h1>
        <p className="text-christmas-gold font-festive text-xl">
          ✨ Feliz Natal 2024! ✨
        </p>
      </div>

      {/* Card de Login */}
      <div className="w-full max-w-sm card-christmas z-10">
        <div className="text-center mb-6">
          <h2 className="text-white font-bold text-xl mb-1">Entrar no Chat</h2>
          <p className="text-white/60 text-sm">
            Entre para celebrar com seus amigos!
          </p>
        </div>

        {/* Erro */}
        {error && (
          <div
            className="bg-christmas-red/20 border border-christmas-red/50 rounded-xl p-3 mb-4 
                          flex items-center gap-2"
          >
            <span>⚠️</span>
            <p className="text-white text-sm">{error}</p>
            <button
              onClick={clearError}
              className="ml-auto text-white/60 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white/80 text-sm font-medium mb-1 block">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              className="input-christmas"
              required
            />
          </div>

          <div>
            <label className="text-white/80 text-sm font-medium mb-1 block">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha secreta"
              className="input-christmas"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-christmas flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⭐</span>
                <span>Entrando...</span>
              </>
            ) : (
              <>
                <span>🎅</span>
                <span>Entrar no Chat</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm">
            Ainda não tem conta?{" "}
            <Link
              to="/register"
              className="text-christmas-gold hover:underline font-semibold"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>

      {/* Decoração inferior */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center gap-4 text-4xl pb-4 z-0">
        {["🎁", "⛄", "🦌", "🎁"].map((emoji, i) => (
          <span key={i} className="opacity-30">
            {emoji}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LoginPage;
