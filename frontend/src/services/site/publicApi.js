/*
  Cliente de la API pública (/api/public/*).

  Por qué no hay TanStack Query ni un store global:
  el sitio público solo LEE, tiene 4 endpoints y ~5 puntos de consumo.
  Lo único que hace falta es:

    1. no pedir lo mismo dos veces a la vez          → `inflight`
    2. no repetir una petición dentro del TTL        → `memory`
    3. no perder datos buenos si un refresco falla   → devuelve el último dato

  El TTL en memoria es igual al `max-age` que envía el servidor, así que
  ambas capas caducan juntas. Pasado el TTL, el navegador revalida con
  ETag y normalmente recibe un 304 sin cuerpo.
*/

import { useEffect, useMemo, useState } from "react";

const TTL = 60_000;

const memory = new Map();
const inflight = new Map();

export class NotFoundError extends Error {}

export const paths = {
  home: "/api/public/home",
  products: "/api/public/products",
  categories: "/api/public/categories",
  product: (key) => `/api/public/products/${encodeURIComponent(key)}`,
};

// Dato todavía vigente, de forma síncrona (evita parpadeos al volver
// a una página ya visitada).
export function peek(path) {
  const hit = memory.get(path);

  return hit && hit.expires > Date.now() ? hit.data : undefined;
}

export function fetchPublic(path, { force = false } = {}) {
  if (!force) {
    const fresh = peek(path);

    if (fresh !== undefined) return Promise.resolve(fresh);
  }

  if (inflight.has(path)) return inflight.get(path);

  const stale = memory.get(path)?.data;

  const request = fetch(path, force ? { cache: "reload" } : undefined)
    .then(async (res) => {
      if (res.status === 404) throw new NotFoundError(path);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      memory.set(path, { data, expires: Date.now() + TTL });

      return data;
    })
    .catch((error) => {
      // Un error temporal (500, red) no destruye lo que ya se mostraba.
      if (stale !== undefined && !(error instanceof NotFoundError)) {
        return stale;
      }

      throw error;
    })
    .finally(() => {
      inflight.delete(path);
    });

  inflight.set(path, request);

  return request;
}

/*
  Se llama desde main.jsx ANTES de que React monte, para que los datos
  viajen en paralelo con la descarga de los chunks lazy en vez de esperar
  a que termine (entry → chunk → fetch).
*/
export function prefetchForPath(pathname) {
  if (pathname === "/login" || pathname.startsWith("/admin")) return;

  const targets = [paths.categories];

  if (pathname === "/") targets.push(paths.home);

  if (pathname === "/products") targets.push(paths.products);

  const product = pathname.match(/^\/product\/([^/]+)\/?$/);

  if (product) {
    try {
      targets.push(paths.product(decodeURIComponent(product[1])));
    } catch {
      // URL mal codificada: la página mostrará "no encontrado".
    }
  }

  targets.forEach((path) => fetchPublic(path).catch(() => {}));
}

/*
  Estado de una petición para componentes:
    status: "loading" | "ready" | "notfound" | "error"
*/
export function usePublicData(path) {
  const [attempt, setAttempt] = useState(0);

  const [state, setState] = useState(() => {
    const cached = path ? peek(path) : undefined;

    return cached !== undefined
      ? { path, status: "ready", data: cached }
      : { path, status: "loading", data: null };
  });

  useEffect(() => {
    if (!path) return undefined;

    let active = true;

    fetchPublic(path, { force: attempt > 0 }).then(
      (data) => {
        if (active) setState({ path, status: "ready", data });
      },
      (error) => {
        if (!active) return;

        setState({
          path,
          status: error instanceof NotFoundError ? "notfound" : "error",
          data: null,
        });
      }
    );

    return () => {
      active = false;
    };
  }, [path, attempt]);

  // Si la ruta cambió y todavía no llegó la respuesta nueva, no se
  // muestran datos de la ruta anterior.
  const current = useMemo(() => {
    if (state.path === path) return state;

    const cached = path ? peek(path) : undefined;

    return cached !== undefined
      ? { path, status: "ready", data: cached }
      : { path, status: "loading", data: null };
  }, [state, path]);

  return {
    status: current.status,
    data: current.data,
    loading: current.status === "loading",
    reload: () => {
      setState({ path, status: "loading", data: null });
      setAttempt((value) => value + 1);
    },
  };
}
