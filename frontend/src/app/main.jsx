import ReactDOM from "react-dom/client";

import AppRoutes from "../routes/AppRoutes";
import { AuthProvider } from "../context/AuthContext.jsx";
import { prefetchForPath } from "../services/site/publicApi";

// Los datos de la página actual se piden YA, en paralelo con la descarga
// de los chunks lazy, en vez de esperar a que React monte.
prefetchForPath(window.location.pathname);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);
