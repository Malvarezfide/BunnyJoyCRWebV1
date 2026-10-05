export function isProductNew(fechaCreacion, days = 14) {
  if (!fechaCreacion) {
    return false;
  }

  const created = new Date(fechaCreacion);

  if (Number.isNaN(created.getTime())) {
    return false;
  }

  const now = new Date();

  const difference =
    (now - created) / (1000 * 60 * 60 * 24);

  return difference >= 0 && difference <= days;
}
