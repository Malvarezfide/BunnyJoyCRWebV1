import "./Sidebar.css";
import { NavLink } from "react-router-dom";

const menu = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: "🏠",
  },
  {
    label: "Productos",
    path: "/admin/products",
    icon: "📦",
  },
  {
    label: "Categorías",
    path: "/admin/categories",
    icon: "🗂️",
  },
  {
    label: "Etiquetas",
    path: "/admin/tags",
    icon: "🏷️",
  },
];

export default function Sidebar({
  isOpen,
  onClose,
}) {
  return (
    <>
      {/* OVERLAY MÓVIL */}

      {isOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={onClose}
          aria-label="Cerrar menú"
        />
      )}


      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          isOpen ? "sidebar--open" : ""
        }`}
      >

        <div className="sidebar-logo">
          <span>🐰</span>
          <span>BunnyJoy Admin</span>
        </div>


        <nav className="sidebar-menu">

          {menu.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              onClick={onClose}
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >

              <span className="sidebar-link-icon">
                {item.icon}
              </span>

              <span>
                {item.label}
              </span>

            </NavLink>

          ))}

        </nav>

      </aside>
    </>
  );
}
