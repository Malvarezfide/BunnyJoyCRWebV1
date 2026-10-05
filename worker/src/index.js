import { json } from "./utils/http";
import { requireAuth } from "./utils/authMiddleware";

import { seoRoutes } from "./routes/seo";
import { shareRoutes } from "./routes/share";
import { imageRoutes } from "./routes/images";
import { publicRoutes } from "./routes/public";
import { authRoutes } from "./routes/auth";
import { productRoutes } from "./routes/products";
import { categoryRoutes } from "./routes/categories";
import { tagRoutes } from "./routes/tags";
import { uploadRoutes } from "./routes/upload";

// Solo se registran en logs las peticiones lentas o fallidas; la
// observabilidad de Workers ya conserva duración y estado de cada
// invocación sin necesidad de un console.log por request.
const SLOW_REQUEST_MS = 1000;

// Rutas /api/* que usan el panel admin. Todas exigen sesión.
const adminRoutes = [
  productRoutes,
  categoryRoutes,
  tagRoutes,
  uploadRoutes,
];

export default {
  async fetch(request, env) {
    const start = performance.now();
    const url = new URL(request.url);

    try {

      // =====================================================
      // /api/*
      //
      //   /api/health   → público
      //   /api/public/* → público, cacheable, solo lectura
      //   /api/auth/*   → login / logout
      //   resto         → PRIVADO: requiere sesión y nunca se cachea
      // =====================================================

      if (url.pathname.startsWith("/api/")) {

        if (url.pathname === "/api/health") {
          return json({ ok: true });
        }

        const publicResponse = await publicRoutes(request, env);
        if (publicResponse) return publicResponse;

        const auth = await authRoutes(request, env);
        if (auth) return auth;

        // Compuerta única: ninguna ruta admin puede olvidar la
        // autenticación, ni siquiera una que se agregue en el futuro.
        const session = await requireAuth(request, env);
        if (!session.ok) return session.response;

        for (const route of adminRoutes) {
          const response = await route(request, env);
          if (response) return response;
        }

        // Nunca dejar que /api/* caiga al SPA.
        return json(
          { error: "API route not found", path: url.pathname },
          404
        );
      }

      // =====================================================
      // SEO: /product/:slug, /sitemap.xml, /robots.txt
      // =====================================================

      const seo = await seoRoutes(request, env);
      if (seo) return seo;

      // =====================================================
      // SHARE (WhatsApp, Facebook, X, …)
      // =====================================================

      const share = await shareRoutes(request, env);
      if (share) return share;

      // =====================================================
      // IMÁGENES R2
      // =====================================================

      const image = await imageRoutes(request, env);
      if (image) return image;

      // =====================================================
      // ASSETS / REACT SPA
      // (solo llegan aquí las rutas listadas en run_worker_first)
      // =====================================================

      return env.ASSETS.fetch(request);

    } catch (error) {

      console.error(
        `[ERROR] ${request.method} ${url.pathname}`,
        error
      );

      return json({ error: "Error interno del servidor" }, 500);

    } finally {

      const duration = performance.now() - start;

      if (duration > SLOW_REQUEST_MS) {
        console.warn(
          `[SLOW] ${request.method} ${url.pathname} → ${duration.toFixed(0)}ms`
        );
      }

    }
  },
};
