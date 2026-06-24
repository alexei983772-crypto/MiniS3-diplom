import { useState } from "react";
import { login } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await login(email, password);

      // 🔥 ВАЖНО: обновляем глобальный auth state
      if (onLogin) onLogin();

      navigate("/");
    } catch {
      alert("Login error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">

      <div className="w-full max-w-sm backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-6">

        <h2 className="text-2xl font-bold text-white mb-2">
          Welcome back
        </h2>

        <p className="text-gray-300 text-sm mb-6">
          Login to continue to Mini-S3
        </p>

        <input
          className="w-full mb-3 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-4 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition font-medium text-white shadow-lg"
        >
          Login
        </button>

        <p className="text-sm mt-4 text-center text-gray-300">
          Нет аккаунта?{" "}
          <Link
            to="/register"
            className="text-blue-400 hover:text-blue-300"
          >
            Зарегистрироваться
          </Link>
        </p>

      </div>

    </div>
  );
}