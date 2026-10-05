import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import * as authService from "../../services/authService";

import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const {
    login,
    isAuthenticated,
  } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await authService.login(
        username,
        password
      );

      login(data);

      navigate("/admin", {
        replace: true,
      });

    } catch (err) {
      setError(
        err.message || "No se pudo iniciar sesión."
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">

      <form
        className="login-card"
        onSubmit={handleSubmit}
      >

        <div className="login-header">

          <h1>
            Panel Administrativo
          </h1>

          <p>
            Inicia sesión para continuar
          </p>

        </div>


        <div className="login-fields">

          {/* USUARIO */}
          <div className="login-field">

            <label htmlFor="username">
              Usuario
            </label>

            <input
              id="username"
              type="text"
              placeholder="Ingrese su usuario"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              autoComplete="username"
              required
            />

          </div>


          {/* CONTRASEÑA */}
          <div className="login-field">

            <label htmlFor="password">
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              autoComplete="current-password"
              required
            />

          </div>

        </div>


        {/* ERROR */}
        {error && (
          <div
            className="login-error"
            role="alert"
          >
            {error}
          </div>
        )}


        {/* BOTÓN */}
        <button
          className="login-button"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Ingresando..."
            : "Ingresar"}
        </button>

      </form>

    </main>
  );
}