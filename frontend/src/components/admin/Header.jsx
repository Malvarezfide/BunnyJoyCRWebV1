import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import "./Header.css";

export default function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();

    navigate("/login", {
      replace: true,
    });
  }

  return (
    <header className="admin-header">

      <div className="admin-header__left">

        <button
          type="button"
          className="admin-header__menu"
          onClick={onMenuClick}
          aria-label="Abrir menú"
        >
          ☰
        </button>

        <div className="admin-header__title">
          <h1>
            Panel Administrativo
          </h1>
        </div>

      </div>

      <div className="admin-header__user">

        <span>
          Administrador
        </span>

        <button
          type="button"
          className="admin-header__logout"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>

      </div>

    </header>
  );
}
