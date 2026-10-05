import { json } from "../utils/http";
import { uploadToR2 } from "../services/uploadService";

/*
  /api/upload — solo administradores.
  La autenticación la aplica index.js para todo /api/* que no sea
  /api/public/* ni /api/auth/*.
*/

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

const MAX_SIZE = 10 * 1024 * 1024;

export async function uploadRoutes(request, env) {

  const url = new URL(request.url);

  if (url.pathname !== "/api/upload") {
    return null;
  }

  const bucket = env["bunnyjoycr-images"];

  // =========================
  // ELIMINAR IMAGEN
  // =========================

  if (request.method === "DELETE") {

    try {

      const { filename } = await request.json();

      if (!filename) {
        return json({ error: "Filename requerido" }, 400);
      }

      await bucket.delete(filename);

      return json({ success: true });

    } catch (error) {

      console.error(error);

      return json({ error: error.message }, 500);

    }

  }

  // =========================
  // SUBIR IMÁGENES
  // =========================

  if (request.method !== "POST") {
    return null;
  }

  const formData = await request.formData();

  const files = formData.getAll("files");

  if (!files.length) {
    return json({ error: "No files provided" }, 400);
  }

  const uploaded = await Promise.all(
    files
      .filter(file => {

        if (!ALLOWED_TYPES.includes(file.type)) {
          console.warn(`Tipo no permitido: ${file.name}`);
          return false;
        }

        if (file.size > MAX_SIZE) {
          console.warn(`${file.name} excede el tamaño permitido`);
          return false;
        }

        return true;

      })
      .map(async file => {

        const fileName = await uploadToR2(file, bucket);

        return {
          filename: fileName,
          url: `/media/${encodeURIComponent(fileName)}`,
          contentType: file.type,
          size: file.size,
        };

      })
  );

  if (!uploaded.length) {
    return json(
      { error: "No se pudo subir ningún archivo válido." },
      400
    );
  }

  return json({
    success: true,
    files: uploaded,
  });

}
