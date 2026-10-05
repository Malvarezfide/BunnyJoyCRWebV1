/*
  Helpers HTTP compartidos por todas las rutas del Worker.

  Política de caché (ver README → "Caché y datos"):
    - json()        → privado, nunca cacheable. Es el valor por defecto,
                      así una ruta nueva no puede quedar cacheada por error.
    - publicJson()  → solo para /api/public/*: cacheable, con ETag y 304.

  No hay cabeceras CORS: el frontend y el Worker viven bajo el mismo
  origen, así que el navegador nunca hace peticiones cross-origin.
*/

export const NO_STORE = "private, no-store";

// TTL del navegador para los datos públicos. Es también el tiempo máximo
// que tarda un visitante en ver un cambio hecho desde el admin.
export const PUBLIC_MAX_AGE = 60;

const BASE_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...BASE_HEADERS,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": NO_STORE,
      ...headers,
    },
  });
}

export function html(body, { status = 200, cacheControl = NO_STORE } = {}) {
  return new Response(body, {
    status,
    headers: {
      ...BASE_HEADERS,
      "Content-Type": "text/html; charset=UTF-8",
      "Cache-Control": cacheControl,
    },
  });
}

export function text(body, contentType, cacheControl) {
  return new Response(body, {
    headers: {
      ...BASE_HEADERS,
      "Content-Type": contentType,
      "Cache-Control": cacheControl,
    },
  });
}

async function etagOf(body) {
  const digest = await crypto.subtle.digest(
    "SHA-1",
    new TextEncoder().encode(body)
  );

  const hex = [...new Uint8Array(digest)]
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `"${hex}"`;
}

// Comparación débil (RFC 9110): Cloudflare puede convertir un ETag
// fuerte en débil (W/"...") al comprimir la respuesta.
function matchesEtag(header, etag) {
  if (!header) return false;

  return header
    .split(",")
    .map((value) => value.trim().replace(/^W\//, ""))
    .some((value) => value === "*" || value === etag);
}

export async function publicJson(request, data, maxAge = PUBLIC_MAX_AGE) {
  const body = JSON.stringify(data);
  const etag = await etagOf(body);

  const headers = {
    ...BASE_HEADERS,
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": `public, max-age=${maxAge}`,
    ETag: etag,
  };

  if (matchesEtag(request.headers.get("If-None-Match"), etag)) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(body, { headers });
}
