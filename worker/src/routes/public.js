/*
  API PÚBLICA — única parte de /api que no requiere sesión.

  GET /api/public/categories
  GET /api/public/home
  GET /api/public/products
  GET /api/public/products/:slug   (también acepta un id numérico)

  Solo lectura, solo productos activos, DTOs mínimos. Las respuestas
  correctas son cacheables (ver publicJson); los errores nunca lo son.
*/

import { json, publicJson } from "../utils/http";

import {
  getPublicCategories,
  getPublicHome,
  getPublicProducts,
  getPublicProduct,
} from "../db/public";

const PREFIX = "/api/public/";

export async function publicRoutes(request, env) {
  const url = new URL(request.url);

  if (!url.pathname.startsWith(PREFIX)) {
    return null;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return json({ error: "Método no permitido" }, 405, {
      Allow: "GET, HEAD",
    });
  }

  const path = url.pathname.replace(/\/$/, "");

  try {
    if (path === "/api/public/categories") {
      return publicJson(request, await getPublicCategories(env.DB));
    }

    if (path === "/api/public/home") {
      return publicJson(request, await getPublicHome(env.DB));
    }

    if (path === "/api/public/products") {
      return publicJson(request, await getPublicProducts(env.DB));
    }

    const match = path.match(/^\/api\/public\/products\/([^/]+)$/);

    if (match) {
      const key = decodeURIComponent(match[1]);
      const result = await getPublicProduct(env.DB, key);

      if (!result) {
        return json({ error: "Producto no encontrado" }, 404);
      }

      return publicJson(request, result);
    }

    return json({ error: "API route not found" }, 404);
  } catch (error) {
    console.error("[PUBLIC API]", path, error);

    return json({ error: "Error interno del servidor" }, 500);
  }
}
