const MAX_SIZE = 10 * 1024 * 1024;

/*
  Nombre seguro para usar en una URL: sin acentos, espacios ni
  caracteres como # ? % que rompen /media/<nombre>.
*/
function safeName(name) {
  const cleaned = String(name || "imagen")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return (cleaned || "imagen").slice(-80);
}

export async function uploadToR2(file, bucket) {
  if (file.size > MAX_SIZE) {
    throw new Error("Archivo demasiado grande");
  }

  // El UUID garantiza que el nombre no se reutiliza jamás, requisito
  // para servir /media con Cache-Control: immutable.
  const fileName = `${crypto.randomUUID()}-${safeName(file.name)}`;

  await bucket.put(fileName, file.stream(), {
    httpMetadata: {
      contentType: file.type,
    },
  });

  return fileName;
}
