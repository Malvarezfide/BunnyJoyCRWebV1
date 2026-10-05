import { createContext, useContext } from "react";

import { paths, usePublicData } from "../services/site/publicApi";

/*
  Categorías ACTIVAS del sitio público (navbar, menú móvil, home).
  Se monta dentro de PublicLayout, así el panel admin no la descarga.
  El panel admin sigue usando services/categoryService.js (API privada).
*/

const CategoriesContext = createContext(null);

export function CategoriesProvider({ children }) {
  const { data, status } = usePublicData(paths.categories);

  const value = {
    categories: data || [],
    loading: status === "loading",
    error: status === "error",
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);

  if (!context) {
    throw new Error(
      "useCategories debe utilizarse dentro de CategoriesProvider."
    );
  }

  return context;
}
