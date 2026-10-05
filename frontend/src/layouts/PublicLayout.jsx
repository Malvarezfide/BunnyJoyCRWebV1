import { Outlet } from "react-router-dom";

import ScrollManager from "../components/layout/ScrollManager";
import Navbar from "../components/layout/Navbar";
import MobileBottomNav from "../components/layout/MobileBottomNav";
import "../components/layout/MobileBottomNav.css";
import Footer from "../components/layout/Footer";
import { CategoriesProvider } from "../context/CategoriesContext";

// Tailwind (y el reset de estilos base) solo se cargan cuando se
// visita el sitio público, gracias a que este layout se importa de
// forma perezosa (lazy) desde AppRoutes. Así el panel admin nunca
// recibe el reset de Tailwind y su propio CSS no se ve afectado.
import "../app/site.css";

// Navbar, contenido estático y footer se pintan de inmediato. Cada
// página y sección pide solo los datos que necesita y maneja su propio
// estado de carga/error.
export default function PublicLayout() {
  return (
    <CategoriesProvider>
      <div
        className="
          min-h-screen
          bg-stone-50
          overflow-x-hidden
          pt-20
          pb-20
          lg:pb-0
        "
      >
        <ScrollManager />

        <Navbar />

        <Outlet />

        <Footer />

        <MobileBottomNav />
      </div>
    </CategoriesProvider>
  );
}
