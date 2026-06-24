import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics"; // ✅ NEW
import Landing from "./pages/Landing";
import Nodes from "./pages/Nodes";

import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const [isAuth, setIsAuth] = useState(
    !!localStorage.getItem("token")
  );

  const handleLogin = () => {
    setIsAuth(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* LANDING */}
        <Route
          path="/"
          element={
            isAuth ? (
              <Navigate to="/dashboard" />
            ) : (
              <Landing />
            )
          }
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            isAuth ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={
            isAuth ? (
              <Navigate to="/dashboard" />
            ) : (
              <Register onLogin={handleLogin} />
            )
          }
        />

        {/* TERMS */}
        <Route path="/terms" element={<Terms />} />

        {/* PRIVACY */}
        <Route path="/privacy" element={<Privacy />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* NODES */}
        <Route
          path="/nodes"
          element={
            <ProtectedRoute>
              <Nodes />
            </ProtectedRoute>
          }
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ANALYTICS */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <Navigate
              to={isAuth ? "/dashboard" : "/"}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}