import { NO_STORE } from "../utils/http";

/*
  GET /media/:filename → objeto de R2.

  Los nombres los genera uploadToR2 como `${uuid}-${nombre}`, por lo que
  un nombre nunca se reutiliza para contenido distinto: es seguro marcar
  la respuesta como inmutable.

  Se usa `onlyIf` para que R2 resuelva If-None-Match: si el navegador ya
  tiene la imagen, responde 304 sin transferir el cuerpo.
*/

const IMMUTABLE = "public, max-age=31536000, immutable";

export async function imageRoutes(request, env) {
  const url = new URL(request.url);

  if (!url.pathname.startsWith("/media/")) {
    return null;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Método no permitido", {
      status: 405,
      headers: { Allow: "GET, HEAD" },
    });
  }

  let filename;

  try {
    filename = decodeURIComponent(url.pathname.slice("/media/".length));
  } catch {
    filename = "";
  }

  if (!filename) {
    return new Response("Nombre de imagen inválido", {
      status: 400,
      headers: { "Cache-Control": NO_STORE },
    });
  }

  const object = await env["bunnyjoycr-images"].get(filename, {
    onlyIf: request.headers,
  });

  if (!object) {
    return new Response("Imagen no encontrada", {
      status: 404,
      headers: { "Cache-Control": NO_STORE },
    });
  }

  const headers = new Headers();

  object.writeHttpMetadata(headers);

  headers.set("ETag", object.httpEtag);
  headers.set("Cache-Control", IMMUTABLE);
  headers.set("X-Content-Type-Options", "nosniff");

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/octet-stream");
  }

  // Si la condición (If-None-Match) se cumple, R2 devuelve el objeto
  // sin cuerpo.
  if (!("body" in object) || object.body === undefined) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(object.body, { headers });
}
