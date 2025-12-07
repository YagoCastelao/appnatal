import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Snowfall from "../components/Snowfall";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (password !== confirmPassword) {
      setLocalError("As senhas não coincidem!");
      return;
    }

    if (password.length < 6) {
      setLocalError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (username.length < 3) {
      setLocalError("O nome de usuário deve ter pelo menos 3 caracteres");
      return;
    }

    const result = await register(username, email, password);
    if (result.success) {
      navigate("/chat");
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-b from-christmas-green to-christmas-green-dark">
      <Snowfall />

      {/* Decoração de fundo */}
      <div className="absolute inset-0 bg-snow-pattern opacity-30" />

      {/* Logo / Título */}
      <div className="text-center mb-6 z-10">
        <div className="text-6xl mb-2 animate-bounce-slow">🎄</div>
        <h1 className="font-christmas text-3xl text-white text-shadow-christmas">
          Junte-se ao Chat!
        </h1>
      </div>

      {/* Card de Registro */}
      <div className="w-full max-w-sm card-christmas z-10">
        <div className="text-center mb-4">
          <h2 className="text-white font-bold text-xl mb-1">Criar Conta</h2>
          <p className="text-white/60 text-sm">
            Máximo de 8 participantes no chat! 🎅
          </p>
        </div>

        {/* Erro */}
        {displayError && (
          <div
            className="bg-christmas-red/20 border border-christmas-red/50 rounded-xl p-3 mb-4 
                          flex items-center gap-2"
          >
            <span>⚠️</span>
            <p className="text-white text-sm">{displayError}</p>
            <button
              onClick={() => {
                clearError();
                setLocalError("");
              }}
              className="ml-auto text-white/60 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-white/80 text-sm font-medium mb-1 block">
              Nome de Usuário
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Seu nome natalino"
              className="input-christmas"
              maxLength={20}
              required
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
              className="input-christmas"
              minLength={6}
              required
            />
          </div>

          <div>
            <label className="text-white/80 text-sm font-medium mb-1 block">
              Confirmar Senha
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Digite a senha novamente"
              className="input-christmas"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-christmas flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⭐</span>
                <span>Criando conta...</span>
              </>
            ) : (
              <>
                <span>🎁</span>
                <span>Criar Conta</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-white/60 text-sm">
            Já tem conta?{" "}
            <Link
              to="/login"
              className="text-christmas-gold hover:underline font-semibold"
            >
              Fazer login
            </Link>
          </p>
        </div>
      </div>

      {/* Info sobre avatares */}
      <div className="mt-6 text-center z-10">
        <p className="text-white/50 text-xs">
          Você receberá um avatar natalino único! 🎅🤶🦌⛄🎄🎁👼❄️
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
