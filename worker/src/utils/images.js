/*
  URL pública de una imagen de producto.

  - "uuid-nombre.webp"  → subida desde el admin, vive en R2 → /media/...
  - "/images/..."       → asset estático legacy, se deja igual
  - "https://..."       → URL externa, se deja igual
*/
export function mediaPath(filename) {
  if (!filename) return null;

  if (filename.startsWith("/") || filename.startsWith("http")) {
    return filename;
  }

  return `/media/${encodeURIComponent(filename)}`;
}

export function absoluteMediaUrl(origin, filename) {
  const path = mediaPath(filename);

  if (!path) return null;

  return path.startsWith("http") ? path : `${origin}${path}`;
}
